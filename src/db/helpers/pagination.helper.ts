import { Base64 } from 'src/shared/utils/base64/base64';
import { InternalServerErrorException } from '@nestjs/common';
import { sql } from 'kysely';
import type { ReferenceExpression, SelectQueryBuilder } from 'kysely';
import type {
  CursorPaginatedResult,
  OffsetPaginatedResult,
  OffsetPaginateOptions,
  CursorPaginationOptions,
  OffsetPaginationMetadata,
  CursorPaginationOptionsOrderBy,
} from 'src/shared/dtos/pagination.dto';

export class Pagination {
  private static extractCursorFromRow<DB, TB extends keyof DB, O extends object>(
    row: O,
    orderBy: CursorPaginationOptionsOrderBy<ReferenceExpression<DB, TB>, O>[],
  ): Record<string, unknown> {
    const cursorData: Record<string, unknown> = {};

    for (const { selectColumn } of orderBy) {
      if (!(selectColumn in row)) {
        throw new Error(
          `Cursor column '${String(selectColumn)}' was not present in the row. ` +
            `Make sure SELECT includes this column or alias.`,
        );
      }

      cursorData[String(selectColumn)] = row[selectColumn];
    }

    return cursorData;
  }

  /**
   * Determines if cursor value being NULL means we're at the "end" for this column
   * (no more rows can come after just by comparing this column)
   */
  private static isNullAtEnd(direction: 'asc' | 'desc', nulls: 'first' | 'last' | undefined): boolean {
    // PostgreSQL defaults: ASC = NULLS LAST, DESC = NULLS FIRST
    const effectiveNulls = nulls ?? (direction === 'asc' ? 'last' : 'first');

    // NULL is at "end" when:
    // - ASC + NULLS LAST: nulls come after all values (at the end)
    // - DESC + NULLS FIRST: nulls come first, but in DESC that means they're "greatest" (at the end)
    return (direction === 'asc' && effectiveNulls === 'last') || (direction === 'desc' && effectiveNulls === 'first');
  }

  private static buildCursorWhere<DB, TB extends keyof DB, O>(
    qb: SelectQueryBuilder<DB, TB, O>,
    cursorValues: Record<string, unknown>,
    orderBy: CursorPaginationOptionsOrderBy<ReferenceExpression<DB, TB>, O>[],
  ) {
    return qb.where(eb => {
      const orConditions: ReturnType<typeof eb.and>[] = [];

      for (let i = 0; i < orderBy.length; i++) {
        const { column, direction, selectColumn, nulls } = orderBy[i];
        const cursorValue = cursorValues[String(selectColumn)];

        // Build equality conditions for all previous columns
        const equalsConditions = [];
        for (let j = 0; j < i; j++) {
          const prev = orderBy[j];
          const prevValue = cursorValues[String(prev.selectColumn)];

          if (prevValue === null) {
            equalsConditions.push(eb(prev.column, 'is', null));
          } else {
            equalsConditions.push(eb(prev.column, '=', prevValue));
          }
        }

        if (cursorValue === null) {
          // Cursor value is NULL - special handling needed
          if (this.isNullAtEnd(direction, nulls)) {
            // NULL is at the end for this column, so no rows come "after" by this column alone
            // Skip adding a condition for this column - only tiebreaker columns matter
            // Don't add to orConditions, continue to next column
            continue;
          } else {
            // NULL is at the beginning (NULLS FIRST with ASC, or NULLS LAST with DESC)
            // "After null" means any non-null value
            const compareCondition = eb(column, 'is not', null);

            if (equalsConditions.length === 0) {
              orConditions.push(compareCondition);
            } else {
              orConditions.push(eb.and([...equalsConditions, compareCondition]));
            }
          }
        } else {
          // Cursor value is not NULL - standard comparison
          const operator = direction === 'asc' ? '>' : '<';
          const compareCondition = eb(column, operator, cursorValue);

          if (equalsConditions.length === 0) {
            orConditions.push(compareCondition);
          } else {
            orConditions.push(eb.and([...equalsConditions, compareCondition]));
          }
        }
      }

      // If all columns had NULL at end, we've exhausted all results
      if (orConditions.length === 0) {
        // Return a condition that matches nothing
        return sql<boolean>`false`;
      }

      return eb.or(orConditions);
    });
  }

  static generateOffsetMeta = (take: number, skip: number, total: number): OffsetPaginationMetadata => {
    const lastPage = Math.ceil(total / take);
    const currentPage = skip === 0 ? 1 : Math.round(skip / take) + 1;

    const meta = {
      total,
      lastPage,
      currentPage,
      perPage: take,
      prev: currentPage > 1 ? currentPage * take - take : null,
      next: currentPage < lastPage ? currentPage * take : null,
    };

    return meta;
  };

  static offset = async <DB, TB extends keyof DB, O = Record<string, unknown>>(
    qb: SelectQueryBuilder<DB, TB, O>,
    { skip = 0, take = 20 }: OffsetPaginateOptions,
  ): Promise<OffsetPaginatedResult<O>> => {
    const [count, data] = await Promise.all([
      qb
        .clearSelect()
        .clearOrderBy()
        .select(eb => eb.fn.countAll<string>().as('total'))
        .executeTakeFirst(),
      qb.limit(take).offset(skip).execute(),
    ]);

    if (!count) {
      throw new InternalServerErrorException('Failed to retrieve total count from database');
    }

    const meta = this.generateOffsetMeta(take, skip, 'total' in count ? Number(count.total) : 0);

    return { data, meta };
  };

  // If you want to pass types for selectColumn, it should be the second generic parameter O
  static cursor = async <DB, TB extends keyof DB, O = Record<string, unknown>>(
    qb: SelectQueryBuilder<DB, TB, O>,
    { take = 20, cursor = null, orderBy }: CursorPaginationOptions<ReferenceExpression<DB, TB>, O>,
  ): Promise<CursorPaginatedResult<O>> => {
    let workingQuery = qb;
    let nextCursor: string | null = null;

    for (const { column, direction, nulls } of orderBy) {
      workingQuery = workingQuery.orderBy(column, ob => {
        let orderBuilder = ob[direction]();

        if (nulls === 'first') {
          orderBuilder = orderBuilder.nullsFirst();
        } else if (nulls === 'last') {
          orderBuilder = orderBuilder.nullsLast();
        }

        return orderBuilder;
      });
    }

    if (cursor) {
      const cursorObj = JSON.parse(Base64.decode(cursor)) as Record<string, unknown>;
      workingQuery = this.buildCursorWhere(workingQuery, cursorObj, orderBy);
    }

    const rows = await workingQuery.limit(take + 1).execute();

    const hasNextPage = rows.length > take;
    const data = hasNextPage ? rows.slice(0, take) : rows;

    if (hasNextPage) {
      const lastRow = data[data.length - 1];
      const cursorData = this.extractCursorFromRow(lastRow, orderBy);
      nextCursor = Base64.encode(JSON.stringify(cursorData));
    }

    return {
      data,
      pagination: {
        hasNextPage,
        cursor: nextCursor,
      },
    };
  };
}

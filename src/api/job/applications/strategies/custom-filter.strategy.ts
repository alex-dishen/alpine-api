import { FilterOperator } from '../dto/column-filter.dto';
import {
  isString,
  isBoolean,
  isStringArray,
  isStringOrNumber,
  isStringOrBoolean,
  type CustomFilterStrategy,
} from './helpers/filter.types';
import { isSelectType } from './helpers/filter.helpers';

export const customFilterStrategies: Record<FilterOperator, CustomFilterStrategy> = {
  // Select/MultiSelect - filter by option_id
  [FilterOperator.IsAnyOf]: (eb, columnId, value) => {
    if (!isStringArray(value) || value.length === 0) return null;

    return eb.exists(
      eb
        .selectFrom('job_column_values as jcv')
        .select('jcv.id')
        .whereRef('jcv.job_id', '=', 'ja.id')
        .where('jcv.column_id', '=', columnId)
        .where('jcv.option_id', 'in', value),
    );
  },

  [FilterOperator.IsNoneOf]: (eb, columnId, value) => {
    if (!isStringArray(value) || value.length === 0) return null;

    return eb.not(
      eb.exists(
        eb
          .selectFrom('job_column_values as jcv')
          .select('jcv.id')
          .whereRef('jcv.job_id', '=', 'ja.id')
          .where('jcv.column_id', '=', columnId)
          .where('jcv.option_id', 'in', value),
      ),
    );
  },

  // Text operators - filter by value column
  [FilterOperator.Contains]: (eb, columnId, value) => {
    if (!isString(value)) return null;

    return eb.exists(
      eb
        .selectFrom('job_column_values as jcv')
        .select('jcv.id')
        .whereRef('jcv.job_id', '=', 'ja.id')
        .where('jcv.column_id', '=', columnId)
        .where('jcv.value', 'ilike', `%${value}%`),
    );
  },

  [FilterOperator.NotContains]: (eb, columnId, value) => {
    if (!isString(value)) return null;

    return eb.or([
      // Either no value exists for this column
      eb.not(
        eb.exists(
          eb
            .selectFrom('job_column_values as jcv')
            .select('jcv.id')
            .whereRef('jcv.job_id', '=', 'ja.id')
            .where('jcv.column_id', '=', columnId),
        ),
      ),
      // Or value doesn't contain the search term
      eb.exists(
        eb
          .selectFrom('job_column_values as jcv')
          .select('jcv.id')
          .whereRef('jcv.job_id', '=', 'ja.id')
          .where('jcv.column_id', '=', columnId)
          .where('jcv.value', 'not ilike', `%${value}%`),
      ),
    ]);
  },

  [FilterOperator.StartsWith]: (eb, columnId, value) => {
    if (!isString(value)) return null;

    return eb.exists(
      eb
        .selectFrom('job_column_values as jcv')
        .select('jcv.id')
        .whereRef('jcv.job_id', '=', 'ja.id')
        .where('jcv.column_id', '=', columnId)
        .where('jcv.value', 'ilike', `${value}%`),
    );
  },

  [FilterOperator.EndsWith]: (eb, columnId, value) => {
    if (!isString(value)) return null;

    return eb.exists(
      eb
        .selectFrom('job_column_values as jcv')
        .select('jcv.id')
        .whereRef('jcv.job_id', '=', 'ja.id')
        .where('jcv.column_id', '=', columnId)
        .where('jcv.value', 'ilike', `%${value}`),
    );
  },

  [FilterOperator.Equals]: (eb, columnId, value) => {
    if (!isStringOrBoolean(value)) return null;

    // Convert boolean to string for checkbox columns (stored as 'true'/'false')
    const compareValue = isBoolean(value) ? String(value) : value;

    return eb.exists(
      eb
        .selectFrom('job_column_values as jcv')
        .select('jcv.id')
        .whereRef('jcv.job_id', '=', 'ja.id')
        .where('jcv.column_id', '=', columnId)
        .where('jcv.value', '=', compareValue),
    );
  },

  [FilterOperator.NotEquals]: (eb, columnId, value) => {
    if (!isStringOrBoolean(value)) return null;

    // Convert boolean to string for checkbox columns (stored as 'true'/'false')
    const compareValue = isBoolean(value) ? String(value) : value;

    return eb.or([
      eb.not(
        eb.exists(
          eb
            .selectFrom('job_column_values as jcv')
            .select('jcv.id')
            .whereRef('jcv.job_id', '=', 'ja.id')
            .where('jcv.column_id', '=', columnId),
        ),
      ),
      eb.exists(
        eb
          .selectFrom('job_column_values as jcv')
          .select('jcv.id')
          .whereRef('jcv.job_id', '=', 'ja.id')
          .where('jcv.column_id', '=', columnId)
          .where('jcv.value', '!=', compareValue),
      ),
    ]);
  },

  [FilterOperator.IsEmpty]: (eb, columnId, _value, columnType) => {
    // For select/multi-select: check if no option_id exists
    if (isSelectType(columnType)) {
      return eb.not(
        eb.exists(
          eb
            .selectFrom('job_column_values as jcv')
            .select('jcv.id')
            .whereRef('jcv.job_id', '=', 'ja.id')
            .where('jcv.column_id', '=', columnId)
            .where('jcv.option_id', 'is not', null),
        ),
      );
    }

    // For other types: check if no value exists OR value is null/empty
    return eb.or([
      eb.not(
        eb.exists(
          eb
            .selectFrom('job_column_values as jcv')
            .select('jcv.id')
            .whereRef('jcv.job_id', '=', 'ja.id')
            .where('jcv.column_id', '=', columnId),
        ),
      ),
      eb.exists(
        eb
          .selectFrom('job_column_values as jcv')
          .select('jcv.id')
          .whereRef('jcv.job_id', '=', 'ja.id')
          .where('jcv.column_id', '=', columnId)
          .where(innerEb => innerEb.or([innerEb('jcv.value', 'is', null), innerEb('jcv.value', '=', '')])),
      ),
    ]);
  },

  [FilterOperator.IsNotEmpty]: (eb, columnId, _value, columnType) => {
    // For select/multi-select: check if at least one option_id exists
    if (isSelectType(columnType)) {
      return eb.exists(
        eb
          .selectFrom('job_column_values as jcv')
          .select('jcv.id')
          .whereRef('jcv.job_id', '=', 'ja.id')
          .where('jcv.column_id', '=', columnId)
          .where('jcv.option_id', 'is not', null),
      );
    }

    // For other types: check if value exists and is not empty
    return eb.exists(
      eb
        .selectFrom('job_column_values as jcv')
        .select('jcv.id')
        .whereRef('jcv.job_id', '=', 'ja.id')
        .where('jcv.column_id', '=', columnId)
        .where('jcv.value', 'is not', null)
        .where('jcv.value', '!=', ''),
    );
  },

  // Number/Date operators for custom columns
  [FilterOperator.GreaterThan]: (eb, columnId, value) => {
    if (!isStringOrNumber(value)) return null;

    return eb.exists(
      eb
        .selectFrom('job_column_values as jcv')
        .select('jcv.id')
        .whereRef('jcv.job_id', '=', 'ja.id')
        .where('jcv.column_id', '=', columnId)
        .where('jcv.value', '>', String(value)),
    );
  },

  [FilterOperator.LessThan]: (eb, columnId, value) => {
    if (!isStringOrNumber(value)) return null;

    return eb.exists(
      eb
        .selectFrom('job_column_values as jcv')
        .select('jcv.id')
        .whereRef('jcv.job_id', '=', 'ja.id')
        .where('jcv.column_id', '=', columnId)
        .where('jcv.value', '<', String(value)),
    );
  },

  [FilterOperator.GreaterThanOrEqual]: (eb, columnId, value) => {
    if (!isStringOrNumber(value)) return null;

    return eb.exists(
      eb
        .selectFrom('job_column_values as jcv')
        .select('jcv.id')
        .whereRef('jcv.job_id', '=', 'ja.id')
        .where('jcv.column_id', '=', columnId)
        .where('jcv.value', '>=', String(value)),
    );
  },

  [FilterOperator.LessThanOrEqual]: (eb, columnId, value) => {
    if (!isStringOrNumber(value)) return null;

    return eb.exists(
      eb
        .selectFrom('job_column_values as jcv')
        .select('jcv.id')
        .whereRef('jcv.job_id', '=', 'ja.id')
        .where('jcv.column_id', '=', columnId)
        .where('jcv.value', '<=', String(value)),
    );
  },

  [FilterOperator.Between]: (eb, columnId, value) => {
    if (!isStringArray(value) || value.length !== 2) return null;

    return eb.exists(
      eb
        .selectFrom('job_column_values as jcv')
        .select('jcv.id')
        .whereRef('jcv.job_id', '=', 'ja.id')
        .where('jcv.column_id', '=', columnId)
        .where('jcv.value', '>=', value[0])
        .where('jcv.value', '<=', value[1]),
    );
  },

  // Boolean operators
  [FilterOperator.IsTrue]: (eb, columnId) =>
    eb.exists(
      eb
        .selectFrom('job_column_values as jcv')
        .select('jcv.id')
        .whereRef('jcv.job_id', '=', 'ja.id')
        .where('jcv.column_id', '=', columnId)
        .where('jcv.value', '=', 'true'),
    ),

  [FilterOperator.IsFalse]: (eb, columnId) =>
    eb.exists(
      eb
        .selectFrom('job_column_values as jcv')
        .select('jcv.id')
        .whereRef('jcv.job_id', '=', 'ja.id')
        .where('jcv.column_id', '=', columnId)
        .where('jcv.value', '=', 'false'),
    ),
};

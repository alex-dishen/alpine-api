import { FilterOperator } from '../dto/column-filter.dto';
import { isString, isStringArray, isStringOrNumber, isPrimitive, type CoreFilterStrategy } from './helpers/filter.types';
import { isNullOnlyType } from './helpers/filter.helpers';

export const coreFilterStrategies: Record<FilterOperator, CoreFilterStrategy> = {
  // Text operators
  [FilterOperator.Contains]: (eb, field, value) => {
    if (!isString(value)) return null;

    return eb(field, 'ilike', `%${value}%`);
  },

  [FilterOperator.NotContains]: (eb, field, value) => {
    if (!isString(value)) return null;

    return eb.or([eb(field, 'not ilike', `%${value}%`), eb(field, 'is', null)]);
  },

  [FilterOperator.Equals]: (eb, field, value) => {
    if (!isPrimitive(value)) return null;

    return eb(field, '=', value);
  },

  [FilterOperator.NotEquals]: (eb, field, value) => {
    if (!isPrimitive(value)) return null;

    return eb.or([eb(field, '!=', value), eb(field, 'is', null)]);
  },

  [FilterOperator.StartsWith]: (eb, field, value) => {
    if (!isString(value)) return null;

    return eb(field, 'ilike', `${value}%`);
  },

  [FilterOperator.EndsWith]: (eb, field, value) => {
    if (!isString(value)) return null;

    return eb(field, 'ilike', `%${value}`);
  },

  [FilterOperator.IsEmpty]: (eb, field, _value, columnType) => {
    if (isNullOnlyType(columnType)) {
      return eb(field, 'is', null);
    }

    return eb.or([eb(field, 'is', null), eb(field, '=', '')]);
  },

  [FilterOperator.IsNotEmpty]: (eb, field, _value, columnType) => {
    if (isNullOnlyType(columnType)) {
      return eb(field, 'is not', null);
    }

    return eb.and([eb(field, 'is not', null), eb(field, '!=', '')]);
  },

  // Number/Date operators
  [FilterOperator.GreaterThan]: (eb, field, value) => {
    if (!isStringOrNumber(value)) return null;

    return eb(field, '>', value);
  },

  [FilterOperator.LessThan]: (eb, field, value) => {
    if (!isStringOrNumber(value)) return null;

    return eb(field, '<', value);
  },

  [FilterOperator.GreaterThanOrEqual]: (eb, field, value) => {
    if (!isStringOrNumber(value)) return null;

    return eb(field, '>=', value);
  },

  [FilterOperator.LessThanOrEqual]: (eb, field, value) => {
    if (!isStringOrNumber(value)) return null;

    return eb(field, '<=', value);
  },

  [FilterOperator.Between]: (eb, field, value) => {
    if (!isStringArray(value) || value.length !== 2) return null;

    return eb.and([eb(field, '>=', value[0]), eb(field, '<=', value[1])]);
  },

  // Boolean operators
  [FilterOperator.IsTrue]: (eb, field) => eb(field, '=', true),

  [FilterOperator.IsFalse]: (eb, field) => eb(field, '=', false),

  // Select/MultiSelect operators
  [FilterOperator.IsAnyOf]: (eb, field, value) => {
    if (!isStringArray(value) || value.length === 0) return null;

    return eb(field, 'in', value);
  },

  [FilterOperator.IsNoneOf]: (eb, field, value) => {
    if (!isStringArray(value) || value.length === 0) return null;

    return eb.or([eb(field, 'not in', value), eb(field, 'is', null)]);
  },
};

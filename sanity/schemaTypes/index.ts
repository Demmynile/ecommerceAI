import { type SchemaTypeDefinition } from 'sanity'
import { customerType } from './customerType'
import { categoryType } from './categoryType'
import { orderType } from './orderType'
import { productType } from './productType'

// import { digitalGoldProductType } from './digitalGoldProductType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    customerType,
    categoryType,
    orderType,
    productType,
    // digitalGoldProductType,
    // digitalGoldOrderType,
  ],
}

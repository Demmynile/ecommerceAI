import { TiersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const GOLD_PURITIES = [
  { title: "24K (99.9% Pure)", value: "24k" },
  { title: "22K (91.6% Pure)", value: "22k" },
  { title: "18K (75% Pure)", value: "18k" },
  { title: "14K (58.3% Pure)", value: "14k" },
];

const GOLD_UNITS = [
  { title: "Troy Ounce (oz)", value: "oz" },
  { title: "Gram (g)", value: "g" },
  { title: "Kilogram (kg)", value: "kg" },
];

const PRODUCT_FORMS = [
  { title: "Bar", value: "bar" },
  { title: "Coin", value: "coin" },
  { title: "Digital Certificate", value: "digital" },
  { title: "Jewelry", value: "jewelry" },
];

export const goldProductType = defineType({
  name: "goldProduct",
  title: "Gold Product",
  type: "document",
  icon: TiersIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "pricing", title: "Pricing" },
    { name: "media", title: "Media" },
    { name: "inventory", title: "Inventory" },
  ],
  fields: [
    defineField({
      name: "name",
      type: "string",
      group: "details",
      title: "Product Name",
      validation: (rule) => rule.required().error("Product name is required"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "details",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required().error("Slug is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      group: "details",
      rows: 4,
      description: "Detailed description of the gold product",
    }),
    defineField({
      name: "productForm",
      title: "Product Form",
      type: "string",
      group: "details",
      options: {
        list: PRODUCT_FORMS,
        layout: "radio",
      },
      validation: (rule) => rule.required().error("Product form is required"),
    }),
    defineField({
      name: "purity",
      type: "string",
      group: "details",
      title: "Gold Purity",
      options: {
        list: GOLD_PURITIES,
        layout: "radio",
      },
      validation: (rule) => rule.required().error("Purity is required"),
    }),
    defineField({
      name: "weight",
      type: "number",
      group: "details",
      title: "Weight",
      description: "Weight of the gold product",
      validation: (rule) => [
        rule.required().error("Weight is required"),
        rule.positive().error("Weight must be positive"),
      ],
    }),
    defineField({
      name: "weightUnit",
      type: "string",
      group: "details",
      title: "Weight Unit",
      options: {
        list: GOLD_UNITS,
        layout: "dropdown",
      },
      initialValue: "oz",
      validation: (rule) => rule.required().error("Weight unit is required"),
    }),
    defineField({
      name: "useLivePrice",
      type: "boolean",
      group: "pricing",
      title: "Use Live Gold Price",
      description:
        "Calculate price based on current market gold price + premium",
      initialValue: true,
    }),
    defineField({
      name: "premiumPercentage",
      type: "number",
      group: "pricing",
      title: "Premium Percentage",
      description: "Markup above spot price (e.g., 5 for 5%)",
      initialValue: 3,
      hidden: ({ parent }) => !parent?.useLivePrice,
      validation: (rule) =>
        rule.min(0).max(100).error("Premium must be between 0-100%"),
    }),
    defineField({
      name: "fixedPrice",
      type: "number",
      group: "pricing",
      title: "Fixed Price (GBP)",
      description: "Fixed price when not using live pricing",
      hidden: ({ parent }) => parent?.useLivePrice,
      validation: (rule) =>
        rule.custom((value, context) => {
          const useLivePrice = (context.parent as any)?.useLivePrice;
          if (!useLivePrice && !value) {
            return "Fixed price is required when not using live pricing";
          }
          return true;
        }),
    }),
    defineField({
      name: "manufacturer",
      type: "string",
      group: "details",
      title: "Manufacturer/Mint",
      description: "e.g., Royal Mint, Perth Mint, PAMP Suisse",
    }),
    defineField({
      name: "certificationNumber",
      type: "string",
      group: "details",
      title: "Certification Number",
      description: "Serial or certification number if applicable",
    }),
    defineField({
      name: "images",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
          ],
        },
      ],
      validation: (rule) =>
        rule.required().min(1).error("At least one image is required"),
    }),
    defineField({
      name: "stock",
      type: "number",
      group: "inventory",
      description: "Available quantity in stock",
      validation: (rule) => [
        rule.required().error("Stock quantity is required"),
        rule.min(0).error("Stock cannot be negative"),
      ],
    }),
    defineField({
      name: "lowStockThreshold",
      type: "number",
      group: "inventory",
      title: "Low Stock Alert Threshold",
      description: "Receive alert when stock falls below this number",
      initialValue: 5,
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "details",
      title: "Featured Product",
      description: "Display in featured products section",
      initialValue: false,
    }),
    defineField({
      name: "isDigital",
      type: "boolean",
      group: "details",
      title: "Digital Product",
      description: "No physical delivery - certificate/digital ownership",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      purity: "purity",
      weight: "weight",
      unit: "weightUnit",
      media: "images.0",
    },
    prepare({ title, purity, weight, unit, media }) {
      return {
        title,
        subtitle: `${purity} | ${weight}${unit}`,
        media,
      };
    },
  },
});

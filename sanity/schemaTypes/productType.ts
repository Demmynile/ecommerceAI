import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

// Product attribute constants for Sanity schema
const COUNTRIES_SANITY_LIST = [
  { title: "India", value: "india" },
  { title: "Italy", value: "italy" },
  { title: "Turkey", value: "turkey" },
  { title: "Egypt", value: "egypt" },
  { title: "Dubai", value: "dubai" },
  { title: "USA", value: "usa" },
];

const CARATS_SANITY_LIST = [
  { title: "14K", value: "14k" },
  { title: "18K", value: "18k" },
  { title: "21K", value: "21k" },
  { title: "22K", value: "22k" },
  { title: "24K", value: "24k" },
];

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "media", title: "Media" },
    { name: "inventory", title: "Inventory" },
  ],
  fields: [
    defineField({
      name: "name",
      type: "string",
      group: "details",
      validation: (rule) => [rule.required().error("Product name is required")],
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "details",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => [
        rule.required().error("Slug is required for URL generation"),
      ],
    }),
    defineField({
      name: "description",
      type: "text",
      group: "details",
      rows: 4,
      description: "Product description",
    }),
    defineField({
      name: "price",
      type: "number",
      group: "details",
      description: "Price in GBP (e.g., 599.99)",
      validation: (rule) => [
        rule.required().error("Price is required"),
        rule.positive().error("Price must be a positive number"),
      ],
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      group: "details",
      validation: (rule) => [rule.required().error("Category is required")],
    }),
    defineField({
      name: "carat",
      type: "string",
      group: "details",
      options: {
        list: CARATS_SANITY_LIST,
        layout: "radio",
      },
    }),
    defineField({
      name: "country",
      type: "string",
      group: "details",
      options: {
        list: COUNTRIES_SANITY_LIST,
        layout: "radio",
      },
    }),
    defineField({
      name: "dimensions",
      type: "string",
      group: "details",
      description: 'e.g., "120cm x 80cm x 75cm"',
    }),
    defineField({
      name: "images",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (rule) => [
        rule.min(1).error("At least one image is required"),
      ],
    }),
    defineField({
      name: "stock",
      type: "number",
      group: "inventory",
      initialValue: 0,
      description: "Number of items in stock",
      validation: (rule) => [
        rule.min(0).error("Stock cannot be negative"),
        rule.integer().error("Stock must be a whole number"),
      ],
    }),
    defineField({
      name: "featured",
      type: "boolean",
      group: "inventory",
      initialValue: false,
      description: "Show on homepage and promotions",
    }),
    defineField({
      name: "assemblyRequired",
      type: "boolean",
      group: "inventory",
      initialValue: false,
      description: "Does this product require assembly?",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      media: "images.0",
      price: "price",
    },
    prepare({ title, subtitle, media, price }) {
      return {
        title,
        subtitle: `${subtitle ? subtitle + " • " : ""}£${price ?? 0}`,
        media,
      };
    },
  },
});
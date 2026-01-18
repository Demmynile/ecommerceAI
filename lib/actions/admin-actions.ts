"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeClient } from "@/sanity/lib/client";

export async function createProductAction() {
  try {
    const newProduct = await writeClient.create({
      _type: "product",
      name: "New Product",
      slug: {
        _type: "slug",
        current: `new-product-${Date.now()}`,
      },
      price: 0,
      stock: 0,
      description: "",
      featured: false,
    });

    revalidatePath("/admin/inventory");
    return { success: true, productId: newProduct._id };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProductAction(
  productId: string,
  data: Record<string, unknown>,
) {
  try {
    await writeClient.patch(productId).set(data).commit();

    revalidatePath("/admin/inventory");
    revalidatePath(`/admin/inventory/${productId}`);
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await writeClient.delete(productId);

    revalidatePath("/admin/inventory");
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: string,
) {
  try {
    await writeClient.patch(orderId).set({ status }).commit();

    revalidatePath("/admin/orders");
    revalidatePath(`/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function publishDocumentAction(documentId: string) {
  try {
    // Get the draft document
    const draft = await writeClient.getDocument(`drafts.${documentId}`);
    
    if (!draft) {
      return { success: false, error: "Draft not found" };
    }

    // Create/update the published version
    await writeClient.createOrReplace({
      ...draft,
      _id: documentId,
    });

    // Delete the draft
    await writeClient.delete(`drafts.${documentId}`);

    revalidatePath("/admin");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to publish document:", error);
    return { success: false, error: "Failed to publish document" };
  }
}

export async function unpublishDocumentAction(documentId: string) {
  try {
    // Get the published document
    const published = await writeClient.getDocument(documentId);
    
    if (!published) {
      return { success: false, error: "Published document not found" };
    }

    // Create the draft version
    await writeClient.createOrReplace({
      ...published,
      _id: `drafts.${documentId}`,
    });

    // Delete the published version
    await writeClient.delete(documentId);

    revalidatePath("/admin");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to unpublish document:", error);
    return { success: false, error: "Failed to unpublish document" };
  }
}

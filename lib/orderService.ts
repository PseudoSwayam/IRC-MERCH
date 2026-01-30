import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface OrderData {
  name: string;
  year?: string;
  size: string;
  transactionId: string;
  merchType?: string;
  timestamp?: Timestamp;
  status?: 'pending' | 'confirmed' | 'processing' | 'completed';
}

export interface OrderResponse {
  success: boolean;
  orderId?: string;
  error?: string;
}

/**
 * Submit an order to Firebase Firestore
 */
export async function submitOrder(orderData: OrderData): Promise<OrderResponse> {
  try {
    // Prepare order document
    const orderDocument = {
      name: orderData.name,
      ...(orderData.year && { year: orderData.year }), // Only add year if provided (backward compatibility)
      size: orderData.size,
      transactionId: orderData.transactionId,
      merchType: orderData.merchType || 'tshirt', // Default to tshirt for backward compatibility
      status: 'pending' as const,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(), // Fallback timestamp
    };

    // Add to Firestore
    const ordersCollection = collection(db, 'orders');
    const docRef = await addDoc(ordersCollection, orderDocument);

    return {
      success: true,
      orderId: docRef.id,
    };
  } catch (error) {
    console.error('Error submitting order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit order',
    };
  }
}

/**
 * Validate if Firebase is properly configured
 */
export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

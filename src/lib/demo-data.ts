import type { ChatRoom, Listing, Message, Profile, PublicProfile, Review, Transaction } from "@/types/database";

export const demoCurrentUserId = "00000000-0000-4000-8000-000000000001";
export const demoBuyerId = "00000000-0000-4000-8000-000000000002";
export const demoSellerId = "00000000-0000-4000-8000-000000000003";

const now = "2026-05-17T19:00:00.000Z";

export const demoProfiles: Profile[] = [
  {
    id: demoCurrentUserId,
    full_name: "Alex Rivera",
    email: "alex.rivera@demo.edu",
    university_domain: "demo.edu",
    university_name: "Demo University",
    enrollment_status: "verified_medical_student",
    avatar_url: null,
    rating: 4.9,
    review_count: 12,
    verified_at: now,
    created_at: now,
    updated_at: now
  },
  {
    id: demoBuyerId,
    full_name: "Jordan Lee",
    email: "jordan.lee@demo.edu",
    university_domain: "demo.edu",
    university_name: "Demo University",
    enrollment_status: "verified_student",
    avatar_url: null,
    rating: 4.8,
    review_count: 7,
    verified_at: now,
    created_at: now,
    updated_at: now
  },
  {
    id: demoSellerId,
    full_name: "Maya Patel",
    email: "maya.patel@med.demo.edu",
    university_domain: "med.demo.edu",
    university_name: "Demo Medical School",
    enrollment_status: "verified_medical_student",
    avatar_url: null,
    rating: 5.0,
    review_count: 18,
    verified_at: now,
    created_at: now,
    updated_at: now
  }
];

export const demoPublicProfiles: PublicProfile[] = demoProfiles.map((profile) => ({
  id: profile.id,
  full_name: profile.full_name,
  university_domain: profile.university_domain,
  university_name: profile.university_name,
  enrollment_status: profile.enrollment_status,
  avatar_url: profile.avatar_url,
  rating: profile.rating,
  review_count: profile.review_count,
  verified_at: profile.verified_at
}));

export const demoListings: Listing[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    seller_id: demoCurrentUserId,
    title: "Netter's Atlas of Human Anatomy, 8th Edition",
    description:
      "Clean copy used for MS1 anatomy. Minimal highlighting, no missing pages, and includes the online access card sleeve.",
    price: 6400,
    category: "Textbooks",
    condition: "Good",
    images: [],
    status: "available",
    created_at: "2026-05-17T18:10:00.000Z",
    updated_at: "2026-05-17T18:10:00.000Z"
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    seller_id: demoSellerId,
    title: "Littmann Cardiology IV Stethoscope",
    description:
      "Navy tube Littmann Cardiology IV. Sanitized, engraved initials on bell, excellent acoustic condition. Pickup near the simulation center.",
    price: 14500,
    category: "Medical Gear",
    condition: "Like New",
    images: [],
    status: "available",
    created_at: "2026-05-17T18:25:00.000Z",
    updated_at: "2026-05-17T18:25:00.000Z"
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    seller_id: demoBuyerId,
    title: "iPad Air with Apple Pencil",
    description:
      "Great for lecture notes and anatomy apps. Includes Apple Pencil, folio case, and USB-C charger. Battery health is strong.",
    price: 42000,
    category: "Electronics",
    condition: "Good",
    images: [],
    status: "pending",
    created_at: "2026-05-17T17:45:00.000Z",
    updated_at: "2026-05-17T17:45:00.000Z"
  },
  {
    id: "10000000-0000-4000-8000-000000000004",
    seller_id: demoSellerId,
    title: "Summer sublease near campus hospital",
    description:
      "Furnished private room in a quiet two-bedroom apartment. Walkable to the hospital and library. Available for summer rotation dates.",
    price: 95000,
    category: "Subleases",
    condition: "New",
    images: [],
    status: "available",
    created_at: "2026-05-17T16:30:00.000Z",
    updated_at: "2026-05-17T16:30:00.000Z"
  }
];

export const demoChatRooms: ChatRoom[] = [
  {
    id: "20000000-0000-4000-8000-000000000001",
    buyer_id: demoCurrentUserId,
    seller_id: demoSellerId,
    listing_id: "10000000-0000-4000-8000-000000000002",
    created_at: "2026-05-17T18:40:00.000Z"
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    buyer_id: demoBuyerId,
    seller_id: demoCurrentUserId,
    listing_id: "10000000-0000-4000-8000-000000000001",
    created_at: "2026-05-17T18:50:00.000Z"
  }
];

export const demoMessages: Message[] = [
  {
    id: "30000000-0000-4000-8000-000000000001",
    chat_room_id: "20000000-0000-4000-8000-000000000001",
    sender_id: demoCurrentUserId,
    text: "Hi Maya, is the Littmann still available?",
    created_at: "2026-05-17T18:41:00.000Z"
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    chat_room_id: "20000000-0000-4000-8000-000000000001",
    sender_id: demoSellerId,
    text: "Yes. I can meet at the Student Union safe exchange table after lab.",
    created_at: "2026-05-17T18:43:00.000Z"
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    chat_room_id: "20000000-0000-4000-8000-000000000002",
    sender_id: demoBuyerId,
    text: "Thanks for the anatomy atlas. Marking this as completed after pickup worked great.",
    created_at: "2026-05-17T18:52:00.000Z"
  }
];

export const demoTransactions: Transaction[] = [
  {
    id: "40000000-0000-4000-8000-000000000001",
    listing_id: "10000000-0000-4000-8000-000000000001",
    chat_room_id: "20000000-0000-4000-8000-000000000002",
    buyer_id: demoBuyerId,
    seller_id: demoCurrentUserId,
    completed_at: "2026-05-17T18:55:00.000Z",
    created_at: "2026-05-17T18:55:00.000Z"
  }
];

export const demoReviews: Review[] = [
  {
    id: "50000000-0000-4000-8000-000000000001",
    transaction_id: "40000000-0000-4000-8000-000000000001",
    reviewer_id: demoBuyerId,
    reviewee_id: demoCurrentUserId,
    rating: 5,
    comment: "Accurate textbook description and met at the library lobby safe zone.",
    created_at: "2026-05-17T18:57:00.000Z"
  }
];

export function getDemoProfile(id: string) {
  return demoProfiles.find((profile) => profile.id === id) ?? null;
}

export function getDemoPublicProfile(id: string) {
  return demoPublicProfiles.find((profile) => profile.id === id) ?? null;
}

export function getDemoListing(id: string) {
  return demoListings.find((listing) => listing.id === id) ?? null;
}

export function getDemoChatRoom(id: string) {
  return demoChatRooms.find((room) => room.id === id) ?? null;
}

export function getDemoListingsForSeller(sellerId: string) {
  return demoListings.filter((listing) => listing.seller_id === sellerId);
}

export function getDemoRoomsForUser(userId: string) {
  return demoChatRooms.filter((room) => room.buyer_id === userId || room.seller_id === userId);
}

export function getDemoPublicProfileMap() {
  return new Map(demoPublicProfiles.map((profile) => [profile.id, profile]));
}

export function getDemoListingMap() {
  return new Map(demoListings.map((listing) => [listing.id, listing]));
}

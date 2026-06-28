import "./index.css";
import {
  BOOKS_DATA,
  REVIEWS_DATA,
  INITIAL_USER,
  INITIAL_ORDERS,
} from "./data.js";
import {
  getFirebaseStatus,
  initFirebase,
  saveFirebaseConfig,
  getFirebaseConfig,
  firebaseLogin,
  firebaseRegister,
  firebaseLogout,
  subscribeToAuth,
  getFirestoreBooks,
  addFirestoreBook,
  deleteFirestoreBook,
  getFirestoreReviews,
  addFirestoreReview,
  getFirestoreUserProfile,
  syncFirestoreUserProfile,
  getFirestoreUserCart,
  syncFirestoreUserCart,
  getFirestoreUserWishlist,
  syncFirestoreUserWishlist,
  getFirestoreOrders,
  syncFirestoreOrders,
  seedFirestoreDatabase,
  uploadFirestoreFile,
  deleteFirestoreFile
} from "./firebase.js";


// SVG Icons Mapping for UI
const ICONS = {
  BookOpen: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  Heart: (cls, fill = "none") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  ShoppingCart: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
  User: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  ShieldCheck: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c3 0 5.6-1.7 6.3-4a1 1 0 0 1 1.4 0c.7 2.3 3.3 4 6.3 4a1 1 0 0 1 1 1v7Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  Library: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>`,
  ArrowRight: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  ChevronLeft: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  ChevronRight: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-9-6"/></svg>`,
  Star: (cls, fill = "none") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  Flame: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  Sparkles: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
  Mail: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  Compass: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  SlidersHorizontal: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="14" y1="4" y2="4"/><line x1="20" x2="20" y1="4" y2="4"/><line x1="4" x2="6" y1="12" y2="12"/><line x1="12" x2="20" y1="12" y2="12"/><line x1="4" x2="14" y1="20" y2="20"/><line x1="20" x2="20" y1="20" y2="20"/><circle cx="17" cy="4" r="3"/><circle cx="9" cy="12" r="3"/><circle cx="17" cy="20" r="3"/></svg>`,
  RotateCcw: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  ArrowUpDown: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>`,
  Trash2: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
  Share2: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`,
  X: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`,
  Plus: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>`,
  Minus: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>`,
  Pencil: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  Clock: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  Check: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  Gift: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8V22"/><path d="M19 12H5"/><path d="M12 8a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5Z"/></svg>`,
  PlusCircle: (cls) =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>`,
};

function getIcon(name, cls = "h-5 w-5", extraArg) {
  if (ICONS[name]) {
    return ICONS[name](cls, extraArg);
  }
  return "";
}

// Global Application State Manager (backed by LocalStorage)
class AppState {
  constructor() {
    this.books = this.load("lumina_books", BOOKS_DATA);
    this.cart = this.load("lumina_cart", []);
    this.wishlist = this.load("lumina_wishlist", []);
    this.user = this.load("lumina_user", INITIAL_USER);
    this.orders = this.load("lumina_orders", INITIAL_ORDERS);
    this.reviews = this.load("lumina_reviews", REVIEWS_DATA);

    this.activeScreen = "home"; // 'home', 'discover', 'detail', 'wishlist', 'checkout', 'dashboard', 'admin'
    this.selectedBookId = null;

    // Discover filter settings
    this.discoverFilters = {
      searchQuery: "",
      genres: [],
      maxPrice: 150,
      minRating: null,
      sortBy: "popularity",
      currentPage: 1,
    };

    // Hero Carousel sliding state
    this.carouselIndex = 0;
    this.carouselTimer = null;

    // Book Detail page reader states
    this.readerPage = 1;
    this.reviewText = "";
    this.reviewRating = 5;
    this.helpfulVotes = { r1: 14, r2: 8, r3: 3 };

    // Coupon code state
    this.appliedCoupon = null; // { code: 'PROMO15', discount: 15 }
    this.promoInput = "";

    // Firebase Integration State
    this.fbUser = null;
    this.showAuthModal = false;
    this.authMode = "login"; // 'login' or 'signup'
    this.authError = null;
    this.firebaseConfigInput = getFirebaseConfig() || {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
    };
  }

  load(key, defaultValue) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  save(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  saveAll() {
    this.save("lumina_books", this.books);
    this.save("lumina_cart", this.cart);
    this.save("lumina_wishlist", this.wishlist);
    this.save("lumina_user", this.user);
    this.save("lumina_orders", this.orders);
    this.save("lumina_reviews", this.reviews);
  }
}

const state = new AppState();

// Core Controller Actions exposed to window
const controller = {
  navigate(screen, payload = null) {
    state.activeScreen = screen;
    if (screen === "detail" && payload) {
      state.selectedBookId = payload;
      // Restore page from user's library progress if the book is owned
      const libItem = state.user?.library?.find((l) => l.bookId === payload);
      if (libItem) {
        const totalPages = 3;
        state.readerPage = Math.max(1, Math.min(totalPages, Math.round((libItem.progress / 100) * totalPages)));
      } else {
        state.readerPage = 1;
      }
    }
    if (screen === "discover") {
      state.discoverFilters.genres = payload ? [payload] : [];
      state.discoverFilters.currentPage = 1;
      state.discoverFilters.searchQuery = "";
    }

    // Handle carousel autoplay timer
    if (screen === "home") {
      this.startCarousel();
    } else {
      this.stopCarousel();
    }

    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  selectBook(id) {
    this.navigate("detail", id);
  },

  toggleWishlist(bookId) {
    const book = state.books.find((b) => b.id === bookId);
    if (!book) return;
    const index = state.wishlist.findIndex((item) => item.id === bookId);
    if (index >= 0) {
      state.wishlist.splice(index, 1);
    } else {
      state.wishlist.push(book);
    }
    state.saveAll();
    if (state.fbUser) {
      syncFirestoreUserWishlist(state.fbUser.uid, state.wishlist);
    }
    this.render();
  },

  clearWishlist() {
    state.wishlist = [];
    state.saveAll();
    if (state.fbUser) {
      syncFirestoreUserWishlist(state.fbUser.uid, state.wishlist);
    }
    this.render();
  },

  addToCart(bookId, navigateToCart = false) {
    const book = state.books.find((b) => b.id === bookId);
    if (!book) return;
    const existing = state.cart.find((item) => item.id === bookId);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({ id: bookId, book, quantity: 1 });
    }
    state.saveAll();
    if (state.fbUser) {
      syncFirestoreUserCart(state.fbUser.uid, state.cart);
    }
    if (navigateToCart) {
      this.navigate("checkout");
    } else {
      this.render();
    }
  },

  updateCartQty(bookId, quantity) {
    const item = state.cart.find((i) => i.id === bookId);
    if (!item) return;
    item.quantity = Math.max(1, parseInt(quantity) || 1);
    state.saveAll();
    if (state.fbUser) {
      syncFirestoreUserCart(state.fbUser.uid, state.cart);
    }
    this.render();
  },

  removeFromCart(bookId) {
    state.cart = state.cart.filter((item) => item.id !== bookId);
    state.saveAll();
    if (state.fbUser) {
      syncFirestoreUserCart(state.fbUser.uid, state.cart);
    }
    this.render();
  },

  applyPromoCode(e) {
    if (e) e.preventDefault();
    const input = document.getElementById("promo-input-field")?.value || "";
    if (input.trim().toUpperCase() === "LUMINA15") {
      state.appliedCoupon = { code: "LUMINA15", discount: 15 };
      alert("15% Discount applied successfully!");
    } else if (
      input.trim().toUpperCase() === "PRO30" &&
      state.user.membership === "Pro"
    ) {
      state.appliedCoupon = { code: "PRO30", discount: 30 };
      alert("Pro exclusive 30% discount applied!");
    } else {
      alert("Invalid coupon code.");
    }
    this.render();
  },

  placeOrder(e) {
    if (e) e.preventDefault();
    if (state.cart.length === 0) return;

    const summary = state.cart.map((item) => ({
      title: item.book.title,
      price: item.book.price,
      quantity: item.quantity,
    }));

    const discountRatio = state.appliedCoupon
      ? (100 - state.appliedCoupon.discount) / 100
      : 1;
    const subtotal = state.cart.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0,
    );
    const total = Number((subtotal * discountRatio).toFixed(2));

    const newOrder = {
      id: `LUM-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      books: summary,
      total: total,
      status: "Delivered",
    };

    // Append ordered books to User's digital library
    state.cart.forEach((item) => {
      const alreadyInLibrary = state.user.library.find(
        (l) => l.bookId === item.id,
      );
      if (!alreadyInLibrary) {
        state.user.library.push({ bookId: item.id, progress: 0 });
      }
    });

    state.orders.unshift(newOrder);
    state.cart = [];
    state.appliedCoupon = null;
    state.saveAll();

    if (state.fbUser) {
      syncFirestoreUserProfile(state.fbUser.uid, state.user);
      syncFirestoreOrders(state.fbUser.uid, state.orders);
      syncFirestoreUserCart(state.fbUser.uid, []);
    }

    alert(`Order Placed Successfully!\nInvoice reference: ${newOrder.id}`);
    this.navigate("dashboard");
  },

  upgradeMembership() {
    if (state.user.membership === "Pro") {
      state.user.membership = "Standard";
      alert("Membership set back to Standard Edition.");
    } else {
      state.user.membership = "Pro";
      alert(
        'Congratulations! You are now a Lumina Pro Member! Exclusive 30% coupons "PRO30" are now active!',
      );
    }
    state.saveAll();
    if (state.fbUser) {
      syncFirestoreUserProfile(state.fbUser.uid, state.user);
    }
    this.render();
  },

  // E-reader page slider
  setReaderPage(page) {
    const pageNum = parseInt(page);
    state.readerPage = pageNum;

    // If the user owns the book, update reading progress in library
    const libItem = state.user?.library?.find((l) => l.bookId === state.selectedBookId);
    if (libItem) {
      const totalPages = 3;
      const progress = Math.round((pageNum / totalPages) * 100);
      libItem.progress = progress;
      state.saveAll();
      if (state.fbUser) {
        syncFirestoreUserProfile(state.fbUser.uid, state.user);
      }
    }
    this.render();
  },

  // Review System
  submitReview(e) {
    if (e) e.preventDefault();
    const comment = document.getElementById("review-comment-box")?.value || "";
    if (!comment.trim()) return;

    const newRev = {
      id: `r-${Date.now()}`,
      bookId: state.selectedBookId,
      author: state.fbUser ? (state.fbUser.displayName || state.fbUser.email) : "Alex Mercer (You)",
      rating: state.reviewRating,
      date: "Today",
      content: comment,
      avatar: state.user.avatar,
    };

    state.reviews.unshift(newRev);
    state.saveAll();
    
    if (getFirebaseStatus().status === "Connected") {
      addFirestoreReview(newRev);
    }

    alert("Thank you for your feedback!");
    const commentBox = document.getElementById("review-comment-box");
    if (commentBox) commentBox.value = "";
    this.render();
  },

  setReviewRating(rating) {
    state.reviewRating = rating;
    this.render();
  },

  voteReviewHelpful(reviewId) {
    state.helpfulVotes[reviewId] = (state.helpfulVotes[reviewId] || 0) + 1;
    this.render();
  },

  // Admin Book management
  async addAdminBook(e) {
    if (e) e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Processing...";
    }

    const title = document.getElementById("admin-title")?.value || "";
    const author = document.getElementById("admin-author")?.value || "";
    const genre = document.getElementById("admin-genre")?.value || "Fiction";
    const price =
      parseFloat(document.getElementById("admin-price")?.value) || 19.99;
    let cover =
      document.getElementById("admin-cover")?.value ||
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400";
    let pdfUrl = "";
    const description =
      document.getElementById("admin-desc")?.value || "No synopsis provided.";

    if (!title || !author) {
      alert("Please provide title and author.");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Add Book To Catalog";
      }
      return;
    }

    const isConnected = getFirebaseStatus().status === "Connected";

    try {
      if (isConnected) {
        const coverFileInput = document.getElementById("admin-cover-file");
        const coverFile = coverFileInput?.files?.[0];
        if (coverFile) {
          const progressContainer = document.getElementById("admin-cover-progress");
          const progressBar = document.getElementById("admin-cover-progress-bar");
          const progressText = document.getElementById("admin-cover-progress-text");
          if (progressContainer) progressContainer.classList.remove("hidden");

          cover = await uploadFirestoreFile(coverFile, "covers", (progress) => {
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.innerText = `Uploading cover: ${progress}%`;
          });
        }

        const pdfFileInput = document.getElementById("admin-pdf-file");
        const pdfFile = pdfFileInput?.files?.[0];
        if (pdfFile) {
          const progressContainer = document.getElementById("admin-pdf-progress");
          const progressBar = document.getElementById("admin-pdf-progress-bar");
          const progressText = document.getElementById("admin-pdf-progress-text");
          if (progressContainer) progressContainer.classList.remove("hidden");

          pdfUrl = await uploadFirestoreFile(pdfFile, "pdfs", (progress) => {
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.innerText = `Uploading PDF: ${progress}%`;
          });
        }
      }

      const newBook = {
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title,
        author,
        description,
        price,
        rating: 4.5,
        reviewsCount: 1,
        genre,
        coverImage: cover,
        fileURL: pdfUrl,
        tags: ["AdminEntry", "New"],
        format: pdfUrl ? ["PDF", "EPUB"] : ["PDF"],
        language: "English (US)",
        rights: "Worldwide",
        publishedDate: "Just Now",
        featured: false,
        trending: true,
        recommended: false,
      };

      state.books.push(newBook);
      state.saveAll();

      if (isConnected) {
        await addFirestoreBook(newBook);
      }

      alert("Book added to library catalog successfully!");
      this.render();
    } catch (err) {
      console.error(err);
      alert("Error adding book: " + err.message);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Add Book To Catalog";
      }
    }
  },

  async deleteAdminBook(id) {
    if (
      confirm("Are you sure you want to remove this book from the catalog?")
    ) {
      const bookToDelete = state.books.find((b) => b.id === id);
      state.books = state.books.filter((b) => b.id !== id);
      state.saveAll();

      if (getFirebaseStatus().status === "Connected") {
        try {
          await deleteFirestoreBook(id);
          if (bookToDelete) {
            if (bookToDelete.coverImage && bookToDelete.coverImage.includes("firebasestorage.googleapis.com")) {
              await deleteFirestoreFile(bookToDelete.coverImage);
            }
            if (bookToDelete.fileURL && bookToDelete.fileURL.includes("firebasestorage.googleapis.com")) {
              await deleteFirestoreFile(bookToDelete.fileURL);
            }
          }
        } catch (err) {
          console.error("Error deleting book assets from Firebase:", err);
        }
      }

      this.render();
    }
  },

  // Firebase Integration Actions
  async initFirebaseSync() {
    const status = getFirebaseStatus();
    if (status.status === "Connected") {
      subscribeToAuth(async (user) => {
        if (user) {
          state.fbUser = user;
          state.authError = null;
          state.showAuthModal = false;
          
          // Fetch or initialize user profile in Firestore
          const profile = await getFirestoreUserProfile(user.uid);
          if (profile) {
            state.user = profile;
          } else {
            state.user = {
              name: user.displayName || user.email.split("@")[0],
              email: user.email,
              membership: "Standard",
              avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150`,
              library: []
            };
            await syncFirestoreUserProfile(user.uid, state.user);
          }

          // Fetch user cart, wishlist, orders from Firestore
          const fsCart = await getFirestoreUserCart(user.uid);
          if (fsCart) state.cart = fsCart;
          const fsWishlist = await getFirestoreUserWishlist(user.uid);
          if (fsWishlist) state.wishlist = fsWishlist;
          const fsOrders = await getFirestoreOrders(user.uid);
          if (fsOrders) state.orders = fsOrders;

        } else {
          state.fbUser = null;
          state.user = state.load("lumina_user", INITIAL_USER);
          state.cart = state.load("lumina_cart", []);
          state.wishlist = state.load("lumina_wishlist", []);
          state.orders = state.load("lumina_orders", INITIAL_ORDERS);
        }
        await this.loadCatalogAndReviews();
        this.render();
      });
    } else {
      state.fbUser = null;
      state.books = state.load("lumina_books", BOOKS_DATA);
      state.reviews = state.load("lumina_reviews", REVIEWS_DATA);
      state.user = state.load("lumina_user", INITIAL_USER);
      state.cart = state.load("lumina_cart", []);
      state.wishlist = state.load("lumina_wishlist", []);
      state.orders = state.load("lumina_orders", INITIAL_ORDERS);
      this.render();
    }
  },

  async loadCatalogAndReviews() {
    const fsBooks = await getFirestoreBooks();
    if (fsBooks && fsBooks.length > 0) {
      state.books = fsBooks;
    } else {
      state.books = state.load("lumina_books", BOOKS_DATA);
    }
    const fsReviews = await getFirestoreReviews();
    if (fsReviews && fsReviews.length > 0) {
      state.reviews = fsReviews;
    } else {
      state.reviews = state.load("lumina_reviews", REVIEWS_DATA);
    }
  },

  openAuthModal(mode = "login") {
    state.showAuthModal = true;
    state.authMode = mode;
    state.authError = null;
    this.render();
  },

  closeAuthModal() {
    state.showAuthModal = false;
    state.authError = null;
    this.render();
  },

  async handleLogin(e) {
    if (e) e.preventDefault();
    const email = document.getElementById("auth-email")?.value;
    const password = document.getElementById("auth-password")?.value;
    
    try {
      await firebaseLogin(email, password);
      state.showAuthModal = false;
      state.authError = null;
      alert("Signed in successfully!");
      this.render();
    } catch (err) {
      console.error(err);
      state.authError = err.message || "Failed to log in.";
      this.render();
    }
  },

  async handleSignup(e) {
    if (e) e.preventDefault();
    const name = document.getElementById("auth-name")?.value;
    const email = document.getElementById("auth-email")?.value;
    const password = document.getElementById("auth-password")?.value;
    
    try {
      await firebaseRegister(email, password, name);
      state.showAuthModal = false;
      state.authError = null;
      alert("Account created successfully!");
      this.render();
    } catch (err) {
      console.error(err);
      state.authError = err.message || "Failed to create account.";
      this.render();
    }
  },

  async handleLogout() {
    try {
      await firebaseLogout();
      alert("Signed out successfully!");
      this.render();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  },

  saveFirebaseConfigInApp(e) {
    if (e) e.preventDefault();
    const config = {
      apiKey: document.getElementById("fb-api-key")?.value,
      projectId: document.getElementById("fb-project-id")?.value,
      authDomain: document.getElementById("fb-auth-domain")?.value || "",
      storageBucket: document.getElementById("fb-storage-bucket")?.value || "",
      messagingSenderId: document.getElementById("fb-messaging-sender-id")?.value || "",
      appId: document.getElementById("fb-app-id")?.value || "",
    };

    saveFirebaseConfig(config);
    state.firebaseConfigInput = config;
    const initialized = initFirebase();
    
    if (initialized) {
      alert("Firebase credentials configured and initialized successfully!");
      this.initFirebaseSync();
    } else {
      alert("Failed to initialize Firebase with the provided credentials. Please check details.");
      this.render();
    }
  },

  resetFirebaseConfigInApp() {
    if (confirm("Are you sure you want to disconnect from Firebase and clear config?")) {
      saveFirebaseConfig(null);
      state.firebaseConfigInput = {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
      };
      initFirebase();
      this.initFirebaseSync();
      alert("Firebase connection config reset. App is in Offline Mode.");
    }
  },

  async seedFirestoreAction() {
    if (confirm("This will seed the database with initial books and review data. Proceed?")) {
      try {
        await seedFirestoreDatabase(BOOKS_DATA, REVIEWS_DATA);
        alert("Firestore database seeded successfully!");
        await this.loadCatalogAndReviews();
        this.render();
      } catch (err) {
        alert("Seeding failed: " + err.message);
      }
    }
  },

  // Discover filters binding
  updateFilters(key, val) {
    state.discoverFilters[key] = val;
    state.discoverFilters.currentPage = 1; // Reset to page 1 on filter changes
    this.render();
  },

  toggleGenreFilter(genre) {
    const idx = state.discoverFilters.genres.indexOf(genre);
    if (idx >= 0) {
      state.discoverFilters.genres.splice(idx, 1);
    } else {
      state.discoverFilters.genres.push(genre);
    }
    state.discoverFilters.currentPage = 1;
    this.render();
  },

  resetDiscoverFilters() {
    state.discoverFilters = {
      searchQuery: "",
      genres: [],
      maxPrice: 150,
      minRating: null,
      sortBy: "popularity",
      currentPage: 1,
    };
    this.render();
  },

  // Carousel slider auto logic
  startCarousel() {
    this.stopCarousel();
    const featured = state.books.filter((b) => b.featured);
    if (featured.length === 0) return;
    state.carouselTimer = setInterval(() => {
      state.carouselIndex = (state.carouselIndex + 1) % featured.length;
      this.renderCarouselSectionOnly();
    }, 6000);
  },

  stopCarousel() {
    if (state.carouselTimer) {
      clearInterval(state.carouselTimer);
      state.carouselTimer = null;
    }
  },

  slidePrev() {
    const featured = state.books.filter((b) => b.featured);
    if (featured.length === 0) return;
    state.carouselIndex =
      (state.carouselIndex - 1 + featured.length) % featured.length;
    this.renderCarouselSectionOnly();
  },

  slideNext() {
    const featured = state.books.filter((b) => b.featured);
    if (featured.length === 0) return;
    state.carouselIndex = (state.carouselIndex + 1) % featured.length;
    this.renderCarouselSectionOnly();
  },

  setCarouselIndex(index) {
    state.carouselIndex = index;
    this.renderCarouselSectionOnly();
  },

  renderCarouselSectionOnly() {
    const carouselEl = document.getElementById("hero-carousel-container");
    if (carouselEl) {
      carouselEl.outerHTML = renderHeroCarouselHTML();
    }
  },

  // Core render pipeline
  render() {
    const root = document.getElementById("root");
    if (!root) return;

    root.innerHTML = `
      <div class="min-h-screen bg-white flex flex-col font-sans text-gray-900 selection:bg-amber-100 selection:text-gray-950">
        ${renderHeaderHTML()}
        <main class="flex-grow">
          ${renderActiveScreenHTML()}
        </main>
        ${renderFooterHTML()}
        ${renderAuthModalHTML()}
      </div>
    `;
  },
};

window.app = controller;

// --- DYNAMIC RENDERING COMPONENT HELPERS (pure string layouts) ---

function renderHeaderHTML() {
  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = state.wishlist.length;

  return `
    <header class="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <!-- Logo -->
        <button
          onclick="window.app.navigate('home')"
          class="flex items-center gap-2.5 transition-transform hover:scale-[1.01] focus:outline-none"
          id="logo-button"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm shadow-gray-900/10">
            ${getIcon("BookOpen", "h-5 w-5")}
          </div>
          <div class="text-left">
            <span class="font-display text-lg font-bold tracking-tight text-gray-900">
              LUMINA
            </span>
            <span class="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
              Books
            </span>
          </div>
        </button>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center gap-1">
          <button
            onclick="window.app.navigate('home')"
            class="rounded-lg px-4 py-2 text-sm font-medium transition-colors ${state.activeScreen === "home" ? "bg-gray-100 text-gray-950 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}"
            id="nav-home"
          >
            Home
          </button>
          <button
            onclick="window.app.navigate('discover')"
            class="rounded-lg px-4 py-2 text-sm font-medium transition-colors ${state.activeScreen === "discover" ? "bg-gray-100 text-gray-950 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}"
            id="nav-discover"
          >
            Discover
          </button>
          <button
            onclick="window.app.navigate('dashboard')"
            class="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${state.activeScreen === "dashboard" ? "bg-gray-100 text-gray-950 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}"
            id="nav-dashboard"
          >
            ${getIcon("Library", "h-4 w-4")}
            My Library
          </button>
          <button
            onclick="window.app.navigate('admin')"
            class="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${state.activeScreen === "admin" ? "bg-gray-100 text-gray-950 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}"
            id="nav-admin"
          >
            ${getIcon("ShieldCheck", "h-4 w-4 text-emerald-600")}
            Admin Portal
          </button>
        </nav>

        <!-- Action Widgets -->
        <div class="flex items-center gap-2 sm:gap-4">
          
          <!-- Wishlist -->
          <button
            onclick="window.app.navigate('wishlist')"
            class="relative rounded-xl p-2.5 transition-colors focus:outline-none ${state.activeScreen === "wishlist" ? "bg-rose-50 text-rose-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}"
            aria-label="View Wishlist"
            id="wishlist-trigger"
          >
            ${getIcon("Heart", "h-5 w-5", state.wishlist.length > 0 ? "currentColor" : "none")}
            ${wishlistCount > 0 ? `<span class="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">${wishlistCount}</span>` : ""}
          </button>

          <!-- Shopping Cart -->
          <button
            onclick="window.app.navigate('checkout')"
            class="relative rounded-xl p-2.5 transition-colors focus:outline-none ${state.activeScreen === "checkout" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}"
            aria-label="View Shopping Cart"
            id="cart-trigger"
          >
            ${getIcon("ShoppingCart", "h-5 w-5")}
            ${cartCount > 0 ? `<span class="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">${cartCount}</span>` : ""}
          </button>

          <div class="h-6 w-px bg-gray-200"></div>

          <!-- User Quick Link / Firebase Auth -->
          ${(() => {
            const status = getFirebaseStatus();
            if (status.status !== "Connected") {
              return `
                <button
                  onclick="window.app.navigate('dashboard')"
                  class="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-gray-50 focus:outline-none"
                  id="user-profile-button"
                >
                  <img
                    src="${state.user.avatar}"
                    alt="${state.user.name}"
                    referrerpolicy="no-referrer"
                    class="h-8 w-8 rounded-full border border-gray-200 object-cover"
                  />
                  <span class="hidden lg:inline text-xs font-semibold text-gray-800">
                    ${state.user.name}
                  </span>
                </button>
              `;
            }

            if (state.fbUser) {
              return `
                <div class="flex items-center gap-2">
                  <button
                    onclick="window.app.navigate('dashboard')"
                    class="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-gray-50 focus:outline-none"
                    id="user-profile-button"
                  >
                    <img
                      src="${state.user.avatar}"
                      alt="${state.user.name}"
                      referrerpolicy="no-referrer"
                      class="h-8 w-8 rounded-full border border-gray-200 object-cover"
                    />
                    <span class="hidden lg:inline text-xs font-semibold text-gray-800">
                      ${state.user.name}
                    </span>
                  </button>
                  <button
                    onclick="window.app.handleLogout()"
                    class="rounded-xl border border-gray-200 hover:bg-gray-50 px-3 py-2 text-xs font-bold text-gray-650 transition-colors focus:outline-none"
                  >
                    Sign Out
                  </button>
                </div>
              `;
            } else {
              return `
                <button
                  onclick="window.app.openAuthModal('login')"
                  class="rounded-xl bg-gray-950 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2.5 transition-colors focus:outline-none flex items-center gap-1.5"
                  id="header-signin-btn"
                >
                  ${getIcon("User", "h-4 w-4")}
                  Sign In
                </button>
              `;
            }
          })()}
        </div>
      </div>
    </header>
  `;
}

function renderActiveScreenHTML() {
  switch (state.activeScreen) {
    case "home":
      return renderHomeHTML();
    case "discover":
      return renderDiscoverHTML();
    case "detail":
      return renderDetailHTML();
    case "wishlist":
      return renderWishlistHTML();
    case "checkout":
      return renderCheckoutHTML();
    case "dashboard":
      return renderDashboardHTML();
    case "admin":
      return renderAdminHTML();
    default:
      return renderHomeHTML();
  }
}

function renderHeroCarouselHTML() {
  const featured = state.books.filter((b) => b.featured);
  if (featured.length === 0) return "";
  const current = featured[state.carouselIndex] || featured[0];
  const isWishlisted = state.wishlist.some((item) => item.id === current.id);

  return `
    <div id="hero-carousel-container" class="relative overflow-hidden rounded-3xl bg-gray-950 text-white shadow-2xl shadow-gray-950/20">
      <div class="absolute inset-0 z-0">
        <img
          src="${current.coverImage}"
          alt="Book Backdrop blur"
          class="h-full w-full object-cover opacity-20 blur-md scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-transparent"></div>
      </div>

      <div class="relative z-10 grid grid-cols-1 items-center gap-8 px-6 py-12 md:grid-cols-2 md:px-12 md:py-16">
        <!-- Text details -->
        <div class="space-y-6 text-left">
          <div class="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3.5 py-1 text-xs font-semibold tracking-wider text-amber-400 uppercase">
            ${getIcon("Sparkles", "h-3.5 w-3.5 animate-pulse text-amber-300")}
            Editor's Pick
          </div>
          
          <h1 class="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
            ${current.title}
          </h1>
          
          <p class="text-base text-gray-300 max-w-lg line-clamp-3 leading-relaxed">
            ${current.description}
          </p>
          
          <div class="flex items-center gap-2.5 text-sm text-gray-400">
            <span class="font-semibold text-white">${current.author}</span>
            <span>•</span>
            <span class="rounded bg-white/15 px-2 py-0.5 text-xs text-amber-300 font-bold flex items-center gap-1">
              ${getIcon("Star", "h-3 w-3 fill-amber-300 text-amber-300")} ${current.rating}
            </span>
            <span>•</span>
            <span class="text-xs uppercase tracking-widest font-mono text-gray-300">${current.genre}</span>
          </div>

          <div class="flex flex-wrap gap-4 pt-2">
            <button
              onclick="window.app.selectBook('${current.id}')"
              class="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-gray-950 shadow-lg transition-all hover:bg-gray-100 focus:outline-none"
            >
              Explore Ebook
              ${getIcon("ArrowRight", "h-4 w-4 transition-transform group-hover:translate-x-0.5")}
            </button>
            
            <button
              onclick="window.app.toggleWishlist('${current.id}')"
              class="inline-flex items-center justify-center rounded-xl border border-white/25 px-5 py-3.5 text-sm font-semibold transition-all hover:bg-white/10 text-white focus:outline-none"
            >
              ${getIcon("Heart", "h-4.5 w-4.5 mr-1.5", isWishlisted ? "currentColor" : "none")}
              ${isWishlisted ? "Saved" : "Wishlist"}
            </button>
          </div>
        </div>

        <!-- Cover preview -->
        <div class="hidden md:flex justify-center items-center">
          <div 
            onclick="window.app.selectBook('${current.id}')"
            class="group relative h-80 w-56 cursor-pointer overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:scale-[1.03]"
          >
            <img
              src="${current.coverImage}"
              alt="${current.title}"
              referrerpolicy="no-referrer"
              class="h-full w-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <span class="text-xs font-semibold text-white flex items-center gap-1.5">
                Preview Sample ${getIcon("Compass", "h-4 w-4")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <button
        onclick="window.app.slidePrev()"
        class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-colors focus:outline-none hidden sm:block"
        aria-label="Previous Slide"
      >
        ${getIcon("ChevronLeft", "h-6 w-6")}
      </button>
      <button
        onclick="window.app.slideNext()"
        class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-colors focus:outline-none hidden sm:block"
        aria-label="Next Slide"
      >
        ${getIcon("ChevronRight", "h-6 w-6")}
      </button>

      <!-- Bullets -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        ${featured
          .map(
            (_, i) => `
          <button
            onclick="window.app.setCarouselIndex(${i})"
            class="h-1.5 rounded-full transition-all ${state.carouselIndex === i ? "w-8 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/60"}"
            aria-label="Go to slide ${i + 1}"
          ></button>
        `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderHomeHTML() {
  const genres = [
    {
      name: "Philosophy",
      desc: "Existential pathways & timeless wisdom",
      img: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=400",
      color: "bg-emerald-950/40 hover:bg-emerald-950/60",
    },
    {
      name: "Technology",
      desc: "Algorithmic futures & digital systems",
      img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400",
      color: "bg-indigo-950/40 hover:bg-indigo-950/60",
    },
    {
      name: "Design",
      desc: "Swiss grids, biophilia & layout syntax",
      img: "https://images.unsplash.com/photo-1500627869374-13cd993b1115?auto=format&fit=crop&q=80&w=400",
      color: "bg-amber-950/40 hover:bg-amber-950/60",
    },
    {
      name: "Fiction",
      desc: "Translucent narratives & dome sci-fi",
      img: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=400",
      color: "bg-rose-950/40 hover:bg-rose-950/60",
    },
  ];

  const trending = state.books.slice(0, 4);
  const recommended = state.books.slice(4, 9);

  return `
    <div class="space-y-16 pb-16 pt-4 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl animate-fade-in">
      
      <!-- Carousel Section -->
      <section id="hero-carousel-section">
        ${renderHeroCarouselHTML()}
      </section>

      <!-- Genres Section -->
      <section id="browse-genres-section">
        <div class="text-left space-y-1 mb-8">
          <p class="text-xs font-bold uppercase tracking-widest text-amber-600">Curated Library</p>
          <h2 class="font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Browse by Editorial Genre
          </h2>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          ${genres
            .map(
              (genre) => `
            <button
              onclick="window.app.navigate('discover', '${genre.name}')"
              class="group relative flex h-44 flex-col justify-end overflow-hidden rounded-2xl p-6 text-left shadow-md shadow-gray-100/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl focus:outline-none"
              id="genre-card-${genre.name.toLowerCase()}"
            >
              <img
                src="${genre.img}"
                alt="${genre.name}"
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div class="absolute inset-0 transition-colors duration-300 ${genre.color}"></div>
              <div class="relative z-10 space-y-1 text-white">
                <span class="font-display text-lg font-bold tracking-tight">${genre.name}</span>
                <p class="text-xs text-gray-200 line-clamp-2 leading-relaxed">${genre.desc}</p>
              </div>
            </button>
          `,
            )
            .join("")}
        </div>
      </section>

      <!-- Trending Section -->
      <section id="trending-section">
        <div class="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
          <div class="text-left space-y-1">
            <div class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-orange-600">
              ${getIcon("Flame", "h-4 w-4 text-orange-500")}
              Hot Releases
            </div>
            <h2 class="font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Trending Now
            </h2>
          </div>
          <button
            onclick="window.app.navigate('discover')"
            class="flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:text-amber-700 transition-colors focus:outline-none"
          >
            Explore All Catalog
            ${getIcon("ArrowRight", "h-4 w-4")}
          </button>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          ${trending
            .map((book) => {
              const isWishlisted = state.wishlist.some(
                (item) => item.id === book.id,
              );
              return `
              <div class="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
                <div class="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-50 shadow-xs">
                  <img
                    src="${book.coverImage}"
                    alt="${book.title}"
                    referrerpolicy="no-referrer"
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <!-- Wishlist -->
                  <button
                    onclick="window.app.toggleWishlist('${book.id}')"
                    class="absolute top-2.5 right-2.5 rounded-full p-2.5 shadow-sm transition-colors focus:outline-none ${isWishlisted ? "bg-rose-500 text-white" : "bg-white/95 text-gray-600 hover:text-rose-600"}"
                  >
                    ${getIcon("Heart", "h-4 w-4", isWishlisted ? "white" : "none")}
                  </button>
                  <!-- Overlay details -->
                  <div class="absolute inset-0 bg-gray-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <button
                      onclick="window.app.selectBook('${book.id}')"
                      class="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-gray-950 shadow-md hover:bg-gray-100 transition-colors focus:outline-none"
                    >
                      Quick Read Details
                    </button>
                  </div>
                </div>

                <div class="mt-4 flex flex-1 flex-col text-left px-1">
                  <div class="flex items-center justify-between gap-1 mb-1.5">
                    <span class="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 uppercase">
                      ${book.genre}
                    </span>
                    <div class="flex items-center gap-1 text-xs font-semibold text-amber-500">
                      ${getIcon("Star", "h-3.5 w-3.5 fill-amber-400 text-amber-400")}
                      <span>${book.rating}</span>
                    </div>
                  </div>

                  <h3 onclick="window.app.selectBook('${book.id}')" class="font-display font-bold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-1 cursor-pointer">
                    ${book.title}
                  </h3>
                  <p class="text-xs text-gray-500 mt-0.5">${book.author}</p>

                  <div class="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span class="font-display text-base font-extrabold text-gray-900">$${book.price.toFixed(2)}</span>
                    <button
                      onclick="window.app.addToCart('${book.id}')"
                      class="text-xs font-semibold text-gray-950 hover:text-amber-700 transition-colors flex items-center gap-1 focus:outline-none"
                    >
                      Buy Ebook
                      ${getIcon("ArrowRight", "h-3.5 w-3.5")}
                    </button>
                  </div>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </section>

      <!-- Recommended Horizontal Scroller -->
      <section id="recommended-section" class="bg-gray-50/50 -mx-4 px-4 py-12 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 rounded-3xl">
        <div class="max-w-7xl mx-auto">
          <div class="text-left space-y-1 mb-8">
            <p class="text-xs font-bold uppercase tracking-widest text-emerald-700">Aesthetic Alignments</p>
            <h2 class="font-display text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Recommended For You
            </h2>
          </div>

          <div class="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-gray-200" id="recommended-scroller">
            ${recommended
              .map(
                (book) => `
              <div
                onclick="window.app.selectBook('${book.id}')"
                class="flex-none w-80 sm:w-96 snap-start cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-md flex gap-4 text-left"
              >
                <div class="h-32 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-xs">
                  <img
                    src="${book.coverImage}"
                    alt="${book.title}"
                    referrerPolicy="no-referrer"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div class="flex flex-col justify-between flex-1 min-w-0">
                  <div class="space-y-1">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                      ${book.genre}
                    </span>
                    <h3 class="font-display font-bold text-gray-900 truncate leading-snug">
                      ${book.title}
                    </h3>
                    <p class="text-xs text-gray-500 truncate">by ${book.author}</p>
                  </div>

                  <div class="space-y-1">
                    <div class="flex items-center justify-between pt-1">
                      <span class="font-display text-sm font-bold text-gray-900">$${book.price.toFixed(2)}</span>
                      <span class="text-xs font-semibold text-amber-700 flex items-center gap-1">
                        ${getIcon("Star", "h-3.5 w-3.5 fill-amber-400 text-amber-400")} ${book.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </section>

      <!-- Newsletter Banner -->
      <section id="newsletter-section">
        <div class="relative overflow-hidden rounded-3xl bg-gray-900 py-16 px-6 text-center shadow-xl sm:px-12 sm:py-20 text-white">
          <div class="absolute inset-0 opacity-15">
            <img
              src="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=1200"
              alt="Grid background"
              class="h-full w-full object-cover mix-blend-overlay"
            />
          </div>
          <div class="relative z-10 mx-auto max-w-2xl space-y-6">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
              ${getIcon("Mail", "h-6 w-6")}
            </div>
            
            <h2 class="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Subscribe to The Reading Room
            </h2>
            
            <p class="mx-auto max-w-lg text-sm leading-relaxed text-gray-300">
              Join 12,000+ bibliophiles who receive our weekly editorial essays, boutique discounts, and exclusive e-reader session newsletters.
            </p>

            <form onsubmit="alert('Thank you for subscribing to The Reading Room!'); this.reset(); return false;" class="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                placeholder="Enter your refined email address"
                class="w-full rounded-xl bg-white/10 px-4 py-3.5 text-sm text-white placeholder-gray-400 border border-white/10 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <button
                type="submit"
                class="rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-semibold text-gray-950 shadow-md hover:bg-amber-300 transition-colors focus:outline-none flex-shrink-0"
              >
                Join Room
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  `;
}

function renderDiscoverHTML() {
  const f = state.discoverFilters;

  // Filtering Logic
  let filtered = state.books.filter((book) => {
    // Search matching
    if (f.searchQuery) {
      const query = f.searchQuery.toLowerCase();
      const match =
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query);
      if (!match) return false;
    }
    // Genre matching
    if (f.genres.length > 0 && !f.genres.includes(book.genre)) {
      return false;
    }
    // Price matching
    if (book.price > f.maxPrice) {
      return false;
    }
    // Rating matching
    if (f.minRating && book.rating < f.minRating) {
      return false;
    }
    return true;
  });

  // Sorting Logic
  if (f.sortBy === "popularity") {
    filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
  } else if (f.sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (f.sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (f.sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (f.sortBy === "newest") {
    filtered.sort((a, b) => (b.publishedDate === "Nov 2024" ? 1 : -1));
  }

  // Pagination Chunk
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const page = Math.min(f.currentPage, totalPages);
  const startIndex = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const genresList = [
    "Fiction",
    "Non-Fiction",
    "Technology",
    "Philosophy",
    "Design",
    "Business",
  ];

  return `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="discover-view-container">
      
      <!-- Top header banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div class="text-left space-y-1">
          <h1 class="font-display text-3xl font-bold tracking-tight text-gray-900">
            Discovery Library
          </h1>
          <p class="text-sm text-gray-500">
            Browse through our premium editorial catalogue of digital masterworks.
          </p>
        </div>
        
        <!-- Search widget -->
        <div class="relative w-full md:w-80">
          <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input
            type="text"
            id="search-input"
            placeholder="Search titles, authors..."
            value="${f.searchQuery}"
            oninput="window.app.updateFilters('searchQuery', this.value)"
            class="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-sm"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Filter Sidebar -->
        <aside class="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left h-fit">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100">
            <span class="font-display font-bold text-gray-900 flex items-center gap-2">
              ${getIcon("SlidersHorizontal", "h-4.5 w-4.5 text-amber-600")}
              Filter Catalog
            </span>
            <button
              onclick="window.app.resetDiscoverFilters()"
              class="text-xs font-semibold text-gray-500 hover:text-amber-700 flex items-center gap-1 focus:outline-none"
            >
              ${getIcon("RotateCcw", "h-3 w-3")}
              Reset All
            </button>
          </div>

          <!-- Genres Filter -->
          <div class="space-y-3">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Editorial Genres</span>
            <div class="space-y-2">
              ${genresList
                .map((genre) => {
                  const checked = f.genres.includes(genre);
                  return `
                  <label class="flex items-center gap-2.5 cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                    <input
                      type="checkbox"
                      ${checked ? "checked" : ""}
                      onclick="window.app.toggleGenreFilter('${genre}')"
                      class="rounded border-gray-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
                    />
                    <span>${genre}</span>
                  </label>
                `;
                })
                .join("")}
            </div>
          </div>

          <!-- Price Slider -->
          <div class="space-y-3 pt-4 border-t border-gray-50">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Max Price Limit</span>
              <span class="text-sm font-bold text-gray-800">$${f.maxPrice}</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              value="${f.maxPrice}"
              oninput="window.app.updateFilters('maxPrice', parseFloat(this.value))"
              class="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
            />
            <div class="flex items-center justify-between text-[11px] text-gray-400">
              <span>$10</span>
              <span>$150</span>
            </div>
          </div>

          <!-- Rating filter -->
          <div class="space-y-3 pt-4 border-t border-gray-50">
            <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Reader Rating</span>
            <div class="space-y-1.5">
              ${[4.5, 4.0, 3.5]
                .map((rating) => {
                  const active = f.minRating === rating;
                  return `
                  <button
                    onclick="window.app.updateFilters('minRating', ${active ? "null" : rating})"
                    class="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm transition-colors focus:outline-none ${active ? "bg-amber-50 font-semibold text-amber-900" : "text-gray-600 hover:bg-gray-50"}"
                  >
                    <span class="flex items-center gap-1">★ ${rating}+ Rating</span>
                    ${active ? getIcon("Check", "h-4 w-4 text-amber-700") : ""}
                  </button>
                `;
                })
                .join("")}
            </div>
          </div>
        </aside>

        <!-- Ebook Grid and Sort options -->
        <main class="lg:col-span-3 space-y-6">
          
          <!-- Top Sort Panel -->
          <div class="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
            <span class="text-sm font-medium text-gray-600">
              Showing <span class="font-bold text-gray-900">${filtered.length}</span> premium ebooks
            </span>
            
            <div class="flex items-center gap-2">
              ${getIcon("ArrowUpDown", "h-4 w-4 text-gray-400")}
              <select
                onchange="window.app.updateFilters('sortBy', this.value)"
                class="text-sm font-semibold text-gray-800 bg-transparent border-none py-1 pr-6 focus:outline-none cursor-pointer"
              >
                <option value="popularity" ${f.sortBy === "popularity" ? "selected" : ""}>Popularity</option>
                <option value="rating" ${f.sortBy === "rating" ? "selected" : ""}>Rating</option>
                <option value="price-low" ${f.sortBy === "price-low" ? "selected" : ""}>Price: Low to High</option>
                <option value="price-high" ${f.sortBy === "price-high" ? "selected" : ""}>Price: High to Low</option>
                <option value="newest" ${f.sortBy === "newest" ? "selected" : ""}>New Releases</option>
              </select>
            </div>
          </div>

          <!-- Dynamic Cards Grid -->
          ${
            filtered.length === 0
              ? `
            <div class="bg-white rounded-3xl border border-dashed border-gray-200 py-20 px-4 text-center">
              <span class="text-sm text-gray-400 font-mono">NO_MATCHING_RECORDS</span>
              <h3 class="font-display font-bold text-lg text-gray-900 mt-2">No Ebooks Match Your Filters</h3>
              <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Try loosening your category selections, widening your price slider, or writing other search keywords.
              </p>
              <button
                onclick="window.app.resetDiscoverFilters()"
                class="mt-6 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors focus:outline-none"
              >
                Clear All Filters
              </button>
            </div>
          `
              : `
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              ${paginated
                .map((book) => {
                  const isWishlisted = state.wishlist.some(
                    (item) => item.id === book.id,
                  );
                  return `
                  <div class="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-3 shadow-xs transition-all duration-300 hover:shadow-md hover:translate-y-[-1px]">
                    
                    <!-- Book cover frame -->
                    <div class="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-50 shadow-xs">
                      <img
                        src="${book.coverImage}"
                        alt="${book.title}"
                        referrerpolicy="no-referrer"
                        class="h-full w-full object-cover"
                      />
                      <!-- Wishlist floating -->
                      <button
                        onclick="window.app.toggleWishlist('${book.id}')"
                        class="absolute top-2 right-2 rounded-full p-2 bg-white/95 text-gray-600 hover:text-rose-600 shadow-sm transition-colors focus:outline-none"
                      >
                        ${getIcon("Heart", "h-4 w-4", isWishlisted ? "rose" : "none")}
                      </button>
                    </div>

                    <!-- Book Metadata details -->
                    <div class="mt-4 flex flex-1 flex-col text-left px-1">
                      <div class="flex items-center justify-between gap-1 mb-1.5">
                        <span class="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 uppercase">
                          ${book.genre}
                        </span>
                        <div class="flex items-center gap-1 text-xs font-medium text-amber-500">
                          ${getIcon("Star", "h-3 w-3 fill-amber-400 text-amber-400")}
                          <span class="text-gray-700">${book.rating}</span>
                        </div>
                      </div>

                      <h3
                        onclick="window.app.selectBook('${book.id}')"
                        class="font-display font-bold text-gray-900 group-hover:text-amber-700 transition-colors cursor-pointer line-clamp-1 leading-snug"
                      >
                        ${book.title}
                      </h3>
                      <p class="text-xs text-gray-500 mt-0.5">${book.author}</p>

                      <div class="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                        <span class="font-display text-base font-extrabold text-gray-900">$${book.price.toFixed(2)}</span>
                        
                        <div class="flex gap-1.5">
                          <button
                            onclick="window.app.addToCart('${book.id}')"
                            class="rounded-lg p-2 bg-gray-50 hover:bg-amber-100 hover:text-amber-900 text-gray-600 transition-colors focus:outline-none"
                            title="Add to library list"
                          >
                            ${getIcon("ShoppingCart", "h-4 w-4")}
                          </button>
                          
                          <button
                            onclick="window.app.selectBook('${book.id}')"
                            class="rounded-lg px-3 py-1.5 bg-gray-950 text-white hover:bg-gray-800 text-[11px] font-semibold transition-colors focus:outline-none"
                          >
                            Read Spec
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
                })
                .join("")}
            </div>
          `
          }

          <!-- Pagination row -->
          ${
            totalPages > 1
              ? `
            <div class="flex items-center justify-between border-t border-gray-100 pt-6">
              <button
                onclick="window.app.updateFilters('currentPage', ${Math.max(1, page - 1)})"
                ${page === 1 ? "disabled" : ""}
                class="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none"
              >
                ${getIcon("ChevronLeft", "h-4 w-4")}
                Previous
              </button>

              <div class="flex gap-1.5">
                ${Array.from({ length: totalPages })
                  .map((_, idx) => {
                    const pNum = idx + 1;
                    return `
                    <button
                      onclick="window.app.updateFilters('currentPage', ${pNum})"
                      class="h-9 w-9 rounded-lg text-sm font-bold transition-all focus:outline-none ${page === pNum ? "bg-gray-950 text-white shadow-xs" : "text-gray-500 hover:bg-gray-50"}"
                    >
                      ${pNum}
                    </button>
                  `;
                  })
                  .join("")}
              </div>

              <button
                onclick="window.app.updateFilters('currentPage', ${Math.min(totalPages, page + 1)})"
                ${page === totalPages ? "disabled" : ""}
                class="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none"
              >
                Next
                ${getIcon("ChevronRight", "h-4 w-4")}
              </button>
            </div>
          `
              : ""
          }

        </main>
      </div>

    </div>
  `;
}

function renderDetailHTML() {
  const book =
    state.books.find((b) => b.id === state.selectedBookId) || state.books[0];
  const isWishlisted = state.wishlist.some((item) => item.id === book.id);

  const samplePages = [
    {
      page: 1,
      title: "Chapter I: The Translucent Shell",
      content:
        "Humanity began its departure from physical soil not with the roaring thrust of space rockets, but with the quiet, seamless illumination of translucent reading screens. We retreated into architectures of pure thought, translating our daily needs, structural constraints, and emotional impulses into algorithms of absolute light.",
    },
    {
      page: 2,
      title: "The Design of Silent Reading",
      content:
        "To build for tomorrow is to design with absolute architectural honesty. We must reject the noisy clutter of telemetry, the fake status coordinates of simulated engines, and the flashing banners of unnecessary alarms. Craft does not come from high-frequency updates, but from precise layouts, generous negative margins, and responsive typography.",
    },
    {
      page: 3,
      title: "An Ocean of Liquid Waves",
      content:
        "As we look out across the digital libraries of the world, we realize that the waves are made of our own collective consciousness. Each node, each terminal, each user profile is a single, vibrating drop in a vast ocean of liquid intelligence. The goal of the modern builder is to chart these currents with absolute precision, providing steady pathways.",
    },
  ];

  const currentPageData = samplePages[state.readerPage - 1] || samplePages[0];

  return `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="book-detail-container">
      
      <!-- Back Header -->
      <div class="flex items-center justify-between mb-8">
        <button
          onclick="window.app.navigate('discover')"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none"
        >
          ${getIcon("ChevronLeft", "h-4.5 w-4.5")}
          Back to Discover Library
        </button>

        <button
          onclick="navigator.clipboard.writeText(window.location.href); alert('Lumina Book Link copied to clipboard!');"
          class="rounded-lg p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none"
          title="Share Book Link"
        >
          ${getIcon("Share2", "h-4.5 w-4.5")}
        </button>
      </div>

      <!-- Identity Grid -->
      <section class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-gray-100">
        <!-- Cover Art -->
        <div class="md:col-span-5 lg:col-span-4 flex justify-center">
          <div class="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl bg-gray-50 shadow-xl shadow-gray-200/50">
            <img
              src="${book.coverImage}"
              alt="${book.title}"
              referrerpolicy="no-referrer"
              class="h-full w-full object-cover"
            />
            ${book.featured ? `<span class="absolute top-4 left-4 rounded bg-amber-400 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-900">Editor's Choice</span>` : ""}
          </div>
        </div>

        <!-- Book Metadata -->
        <div class="md:col-span-7 lg:col-span-8 space-y-6 text-left flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="rounded bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 uppercase">
                ${book.genre}
              </span>
              <div class="flex items-center gap-1 text-sm font-semibold text-amber-500">
                ${getIcon("Star", "h-4 w-4 fill-amber-400 text-amber-400")}
                <span>${book.rating}</span>
                <span class="text-xs text-gray-400 font-normal">(${book.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 class="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-gray-900 leading-tight">
              ${book.title}
            </h1>
            <p class="text-sm text-gray-500 font-medium">
              A work of digital craftsmanship by <span class="text-gray-900 font-semibold">${book.author}</span>
            </p>

            <div class="text-3xl font-display font-extrabold text-gray-900 pt-2">
              $${book.price.toFixed(2)}
              <span class="text-xs text-gray-400 font-normal ml-2 tracking-widest uppercase">Instant Digital Delivery</span>
            </div>
          </div>

          <!-- CTAs -->
          <div class="flex flex-wrap gap-4 py-4">
            <button
              onclick="window.app.addToCart('${book.id}', true)"
              class="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-gray-800 transition-colors focus:outline-none"
            >
              ${getIcon("ShoppingCart", "h-4 w-4")}
              Instant Purchase Ebook
            </button>

            <button
              onclick="window.app.toggleWishlist('${book.id}')"
              class="inline-flex items-center justify-center rounded-xl border px-5 py-3.5 text-sm font-semibold transition-all focus:outline-none ${isWishlisted ? "border-rose-200 bg-rose-50 text-rose-600 shadow-xs" : "border-gray-200 hover:bg-gray-50 text-gray-700"}"
            >
              ${getIcon("Heart", "h-4.5 w-4.5 mr-1.5", isWishlisted ? "rose" : "none")}
              ${isWishlisted ? "In Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          <!-- Specifications Bento -->
          <div class="grid grid-cols-2 gap-4 lg:grid-cols-4 pt-4 border-t border-gray-100">
            <div class="bg-gray-50/50 p-3.5 rounded-xl text-left">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Available formats</span>
              <span class="block text-xs font-bold text-gray-800 mt-1">${book.format.join(", ")}</span>
            </div>
            <div class="bg-gray-50/50 p-3.5 rounded-xl text-left">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Language</span>
              <span class="block text-xs font-bold text-gray-800 mt-1">${book.language}</span>
            </div>
            <div class="bg-gray-50/50 p-3.5 rounded-xl text-left">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Rights license</span>
              <span class="block text-xs font-bold text-gray-800 mt-1">${book.rights}</span>
            </div>
            <div class="bg-gray-50/50 p-3.5 rounded-xl text-left">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Release Date</span>
              <span class="block text-xs font-bold text-gray-800 mt-1">${book.publishedDate}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Synopsis Section -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12 border-b border-gray-100">
        <div class="lg:col-span-5 text-left space-y-4">
          <div class="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800">
            ${getIcon("BookOpen", "h-3.5 w-3.5")}
            Editorial Synopsis
          </div>
          <h2 class="font-display text-2xl font-bold text-gray-900 tracking-tight">
            Inside the Mind of ${book.author}
          </h2>
          <p class="text-xs text-gray-400 font-mono">CATALOG_ID: LUM-${book.id.toUpperCase()}</p>
        </div>

        <div class="lg:col-span-7 text-left">
          <p class="text-base text-gray-600 leading-relaxed font-sans first-letter:text-4xl first-letter:font-bold first-letter:font-display first-letter:text-amber-700 first-letter:mr-2 first-letter:float-left">
            ${book.description}
          </p>
        </div>
      </section>

      <!-- INTERACTIVE DIGITAL READER SPECIMEN -->
      <section class="py-12 border-b border-gray-100" id="interactive-reader-section">
        <div class="text-left space-y-2 mb-8">
          <div class="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-800">
            ${getIcon("Clock", "h-3.5 w-3.5")}
            3-Minute Interactive Sample
          </div>
          <h2 class="font-display text-2xl font-bold text-gray-900 tracking-tight">
            Read Dynamic Book Sample Pages
          </h2>
          <p class="text-sm text-gray-500">
            Experience the typography and structure of this digital edition instantly.
          </p>
        </div>

        <!-- E-Reader specimen markup -->
        <div class="mx-auto max-w-3xl rounded-2xl border border-amber-100/60 bg-amber-50/25 p-6 md:p-10 shadow-inner">
          <div class="flex items-center justify-between border-b border-amber-100/50 pb-4 mb-6">
            <span class="font-mono text-xs text-amber-900/60 uppercase tracking-widest">
              LUMINA SECURE READER PRO
            </span>
            <span class="text-xs font-bold text-amber-900/80">
              Page ${state.readerPage} of ${samplePages.length}
            </span>
          </div>

          <div class="min-h-36 text-left space-y-4">
            <h3 class="font-display text-lg font-bold text-amber-950">
              ${currentPageData.title}
            </h3>
            <p class="text-sm sm:text-base text-amber-900/90 leading-relaxed font-serif italic">
              "${currentPageData.content}"
            </p>
          </div>

          <!-- Reader Slider Navigation -->
          <div class="mt-8 pt-6 border-t border-amber-100/50 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div class="flex items-center gap-3 w-full sm:w-2/3">
              <span class="text-xs font-bold text-amber-900/60 font-mono">SLIDE</span>
              <input
                type="range"
                min="1"
                max="${samplePages.length}"
                value="${state.readerPage}"
                oninput="window.app.setReaderPage(this.value)"
                class="w-full h-1 bg-amber-200/50 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <span class="text-xs font-bold text-amber-900/60 font-mono">${samplePages.length}</span>
            </div>

            <div class="flex gap-2">
              <button
                onclick="window.app.setReaderPage(${Math.max(1, state.readerPage - 1)})"
                ${state.readerPage === 1 ? "disabled" : ""}
                class="rounded-lg border border-amber-200/60 px-3 py-1.5 text-xs font-bold text-amber-900/70 hover:bg-amber-100/50 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
              >
                Prev
              </button>
              <button
                onclick="window.app.setReaderPage(${Math.min(samplePages.length, state.readerPage + 1)})"
                ${state.readerPage === samplePages.length ? "disabled" : ""}
                class="rounded-lg bg-amber-600 hover:bg-amber-700 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Community Reviews panel -->
      <section class="py-12" id="reviews-section">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Submit Form -->
          <div class="lg:col-span-4 text-left space-y-4">
            <h2 class="font-display text-2xl font-bold text-gray-900 tracking-tight">
              Community Reviews
            </h2>
            <p class="text-xs text-gray-500 leading-relaxed">
              Read transparent feedback written by readers. Submit your own thoughts below to enrich our catalog.
            </p>

            <form onsubmit="window.app.submitReview(event)" class="space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
              <span class="block text-xs font-bold uppercase tracking-wider text-gray-400">Write a Review</span>
              
              <div>
                <label class="block text-[11px] font-bold text-gray-500 uppercase">Your rating</label>
                <div class="flex gap-1.5 mt-1.5">
                  ${[1, 2, 3, 4, 5]
                    .map(
                      (val) => `
                    <button
                      key="${val}"
                      type="button"
                      onclick="window.app.setReviewRating(${val})"
                      class="focus:outline-none text-amber-400"
                    >
                      ${getIcon("Star", "h-5 w-5", val <= state.reviewRating ? "currentColor" : "none")}
                    </button>
                  `,
                    )
                    .join("")}
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-500 uppercase">Review comments</label>
                <textarea
                  id="review-comment-box"
                  required
                  placeholder="Share your layout thoughts, typographic feeling..."
                  rows="3"
                  class="w-full mt-1.5 p-3 rounded-xl border border-gray-200 bg-white placeholder-gray-400 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                ></textarea>
              </div>

              <button
                type="submit"
                class="w-full rounded-xl bg-gray-950 hover:bg-gray-800 text-white text-xs font-semibold py-3 transition-colors focus:outline-none"
              >
                Submit Review
              </button>
            </form>
          </div>

          <!-- Reviews list -->
          <div class="lg:col-span-8 space-y-6 text-left">
            ${(() => {
              const bookReviews = state.reviews.filter((rev) => !rev.bookId || rev.bookId === book.id);
              if (bookReviews.length === 0) {
                return `
                  <div class="bg-gray-50/50 rounded-2xl border border-dashed border-gray-250 py-10 px-4 text-center">
                    <p class="text-xs text-gray-500 font-medium">No reviews yet for this edition. Be the first to share your thoughts!</p>
                  </div>
                `;
              }
              return bookReviews.map((rev) => {
                const helpfulCount = state.helpfulVotes[rev.id] || 0;
                return `
                <div class="p-5 rounded-2xl border border-gray-100 bg-white shadow-xs">
                  <div class="flex items-center gap-3">
                    <img
                      src="${rev.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"}"
                      alt="${rev.author}"
                      referrerpolicy="no-referrer"
                      class="h-9 w-9 rounded-full object-cover border border-gray-100"
                    />
                    <div>
                      <span class="block text-sm font-semibold text-gray-900">${rev.author}</span>
                      <span class="block text-[10px] text-gray-400 font-mono">${rev.date}</span>
                    </div>

                    <div class="ml-auto flex text-amber-400">
                      ${Array.from({ length: 5 })
                        .map(
                          (_, idx) => `
                        ${getIcon("Star", "h-3.5 w-3.5", idx < rev.rating ? "currentColor" : "none")}
                      `,
                        )
                        .join("")}
                    </div>
                  </div>

                  <p class="mt-3 text-sm text-gray-600 leading-relaxed font-sans">
                    "${rev.content}"
                  </p>

                  <div class="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <button
                      onclick="window.app.voteReviewHelpful('${rev.id}')"
                      class="text-xs font-semibold text-gray-500 hover:text-amber-700 flex items-center gap-1 transition-colors focus:outline-none"
                    >
                      Helpful (${helpfulCount})
                    </button>
                    <span class="text-[10px] uppercase font-mono text-gray-400 tracking-wider">
                      VERIFIED_BUYER
                    </span>
                  </div>
                </div>
              `;
              }).join("");
            })()}
          </div>

        </div>
      </section>

    </div>
  `;
}

function renderWishlistHTML() {
  const list = state.wishlist;

  return `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="wishlist-view-container">
      
      <!-- Top actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div class="text-left space-y-1">
          <div class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-rose-600">
            ${getIcon("Heart", "h-4 w-4 text-rose-500 fill-rose-500 animate-pulse")}
            Curated Treasures
          </div>
          <h1 class="font-display text-3xl font-bold tracking-tight text-gray-900">
            Your Wishlist
          </h1>
          <p class="text-sm text-gray-500">
            Your personal treasury of boutique digital literature awaiting acquisition.
          </p>
        </div>

        ${
          list.length > 0
            ? `
          <div class="flex items-center gap-2.5">
            <button
              onclick="navigator.clipboard.writeText(window.location.href); alert('Wishlist link shared!');"
              class="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none"
            >
              ${getIcon("Share2", "h-4 w-4")}
              Share List
            </button>
            <button
              onclick="window.app.clearWishlist()"
              class="inline-flex items-center gap-1.5 rounded-xl bg-red-50 hover:bg-red-100 px-4 py-2.5 text-xs font-semibold text-red-700 transition-colors focus:outline-none"
            >
              ${getIcon("Trash2", "h-4 w-4")}
              Clear All
            </button>
          </div>
        `
            : ""
        }
      </div>

      <!-- Main wishlist grid -->
      ${
        list.length === 0
          ? `
        <div class="bg-white rounded-3xl border border-dashed border-gray-200 py-20 px-4 text-center max-w-xl mx-auto">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-4">
            ${getIcon("Heart", "h-6 w-6")}
          </div>
          <h3 class="font-display font-bold text-xl text-gray-900">Your Wishlist is Empty</h3>
          <p class="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
            You haven't bookmarked any digital masterpieces yet. Explore our discovery catalog to gather your favorites.
          </p>
          <button
            onclick="window.app.navigate('discover')"
            class="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-950 hover:bg-gray-800 px-6 py-3 text-sm font-semibold text-white transition-all focus:outline-none"
          >
            Browse Discovery Catalog
            ${getIcon("ArrowRight", "h-4 w-4")}
          </button>
        </div>
      `
          : `
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          ${list
            .map(
              (book) => `
            <div class="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-3 shadow-xs transition-all duration-300 hover:shadow-md">
              <div class="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-50">
                <img
                  src="${book.coverImage}"
                  alt="${book.title}"
                  referrerpolicy="no-referrer"
                  class="h-full w-full object-cover"
                />
                
                <!-- Quick Remove -->
                <button
                  onclick="window.app.toggleWishlist('${book.id}')"
                  class="absolute top-2.5 right-2.5 rounded-full bg-gray-950/80 hover:bg-red-600 p-2 text-white shadow-sm transition-colors focus:outline-none"
                  title="Remove"
                >
                  ${getIcon("X", "h-3.5 w-3.5")}
                </button>
              </div>

              <div class="mt-4 flex flex-1 flex-col text-left px-1">
                <span class="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 uppercase w-fit mb-1.5">
                  ${book.genre}
                </span>

                <h3
                  onclick="window.app.selectBook('${book.id}')"
                  class="font-display font-bold text-gray-900 hover:text-amber-700 transition-colors cursor-pointer line-clamp-1"
                >
                  ${book.title}
                </h3>
                <p class="text-xs text-gray-500 mt-0.5">${book.author}</p>

                <div class="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span class="font-display text-base font-bold text-gray-900">$${book.price.toFixed(2)}</span>
                  
                  <div class="flex gap-2">
                    <button
                      onclick="window.app.addToCart('${book.id}')"
                      class="rounded-lg p-2 bg-gray-100 hover:bg-amber-100 hover:text-amber-900 text-gray-700 transition-colors focus:outline-none"
                      title="Add to shopping basket"
                    >
                      ${getIcon("ShoppingCart", "h-4 w-4")}
                    </button>
                    <button
                      onclick="window.app.selectBook('${book.id}')"
                      class="rounded-lg bg-gray-950 text-white hover:bg-gray-800 text-[11px] font-semibold px-2.5 py-1.5 transition-colors focus:outline-none"
                    >
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      `
      }

    </div>
  `;
}

function renderCheckoutHTML() {
  const subtotal = state.cart.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0,
  );
  const discountRatio = state.appliedCoupon
    ? (100 - state.appliedCoupon.discount) / 100
    : 1;
  const total = subtotal * discountRatio;

  return `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="checkout-view-container">
      
      <div class="text-left space-y-1 mb-8">
        <h1 class="font-display text-3xl font-bold tracking-tight text-gray-900">
          Shopping Cart & Checkout
        </h1>
        <p class="text-sm text-gray-500">
          Complete your credentials to acquire your high-fidelity reading access instantly.
        </p>
      </div>

      ${
        state.cart.length === 0
          ? `
        <div class="bg-white rounded-3xl border border-dashed border-gray-200 py-20 px-4 text-center max-w-xl mx-auto">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500 mb-4">
            ${getIcon("ShoppingCart", "h-6 w-6")}
          </div>
          <h3 class="font-display font-bold text-xl text-gray-900">Your Shopping Basket is Empty</h3>
          <p class="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
            You don't have any premium digital items currently registered.
          </p>
          <button
            onclick="window.app.navigate('discover')"
            class="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-950 hover:bg-gray-800 px-6 py-3 text-sm font-semibold text-white transition-colors focus:outline-none"
          >
            Acquire Ebooks Now
            ${getIcon("ArrowRight", "h-4 w-4")}
          </button>
        </div>
      `
          : `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Items List (Left Columns) -->
          <div class="lg:col-span-7 space-y-4">
            <h2 class="text-lg font-bold text-gray-900 text-left pb-2 border-b border-gray-100">Selected Ebooks</h2>
            
            <div class="space-y-3.5">
              ${state.cart
                .map(
                  (item) => `
                <div class="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs text-left">
                  <div class="h-20 w-14 overflow-hidden rounded bg-gray-50 shadow-xs flex-shrink-0">
                    <img src="${item.book.coverImage}" class="h-full w-full object-cover" />
                  </div>
                  
                  <div class="flex-grow min-w-0">
                    <h3 class="font-display font-bold text-sm text-gray-900 truncate">${item.book.title}</h3>
                    <p class="text-xs text-gray-500 mt-0.5">by ${item.book.author}</p>
                    <span class="text-xs font-semibold text-gray-950 mt-1.5 block">$${item.book.price}</span>
                  </div>

                  <!-- Quantity widget -->
                  <div class="flex items-center gap-1 border border-gray-100 rounded-lg p-1">
                    <button
                      onclick="window.app.updateCartQty('${item.id}', ${item.quantity - 1})"
                      class="p-1 text-gray-500 hover:text-gray-900 transition-colors focus:outline-none"
                    >
                      ${getIcon("Minus", "h-3.5 w-3.5")}
                    </button>
                    <span class="px-2 text-xs font-bold font-mono text-gray-800">${item.quantity}</span>
                    <button
                      onclick="window.app.updateCartQty('${item.id}', ${item.quantity + 1})"
                      class="p-1 text-gray-500 hover:text-gray-900 transition-colors focus:outline-none"
                    >
                      ${getIcon("Plus", "h-3.5 w-3.5")}
                    </button>
                  </div>

                  <!-- Remove link -->
                  <button
                    onclick="window.app.removeFromCart('${item.id}')"
                    class="p-2 text-gray-400 hover:text-red-600 transition-colors focus:outline-none"
                    title="Remove item"
                  >
                    ${getIcon("Trash2", "h-4 w-4")}
                  </button>
                </div>
              `,
                )
                .join("")}
            </div>

            <!-- Upselling and security banner -->
            <div class="bg-amber-50/20 border border-amber-100 p-4 rounded-2xl flex items-start gap-3 text-left">
              <div class="p-1 text-amber-700 bg-amber-100/40 rounded-lg">
                ${getIcon("Gift", "h-5 w-5")}
              </div>
              <div>
                <h4 class="text-xs font-bold text-amber-900 uppercase">Premium Member Discount?</h4>
                <p class="text-xs text-amber-800 mt-1">
                  Pro subscribers enjoy an exclusive 30% discount. Set your account status to Pro inside your Library tab, and use coupon code <span class="font-mono font-bold">PRO30</span>.
                </p>
              </div>
            </div>
          </div>

          <!-- Checkout Details Panel (Right Columns) -->
          <div class="lg:col-span-5 bg-gray-50/50 rounded-2xl p-6 border border-gray-100 h-fit text-left space-y-6">
            <h2 class="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">Invoice Summary</h2>
            
            <!-- Pricing breakdown -->
            <div class="space-y-2 text-sm">
              <div class="flex justify-between text-gray-600">
                <span>Ebooks subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              ${
                state.appliedCoupon
                  ? `
                <div class="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount (${state.appliedCoupon.code})</span>
                  <span>-${state.appliedCoupon.discount}%</span>
                </div>
              `
                  : ""
              }
              <div class="flex justify-between text-gray-600">
                <span>Digital Delivery Tax</span>
                <span class="text-gray-400 font-mono">FREE</span>
              </div>
              <div class="h-px bg-gray-200 my-2"></div>
              <div class="flex justify-between text-base font-extrabold text-gray-900">
                <span>Grand Total</span>
                <span>$${total.toFixed(2)}</span>
              </div>
            </div>

            <!-- Coupon Input -->
            <form onsubmit="window.app.applyPromoCode(event)" class="flex gap-2">
              <input
                type="text"
                id="promo-input-field"
                placeholder="PROMO15 / PRO30"
                class="flex-grow p-2.5 rounded-xl border border-gray-200 bg-white placeholder-gray-400 text-xs focus:border-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                class="bg-gray-900 text-white rounded-xl px-4 text-xs font-semibold hover:bg-gray-800 transition-colors focus:outline-none"
              >
                Apply
              </button>
            </form>

            <!-- Checkout Form -->
            <form onsubmit="window.app.placeOrder(event)" class="space-y-4 pt-4 border-t border-gray-100">
              <span class="block text-xs font-bold uppercase tracking-wider text-gray-400">Payment Credentials</span>
              
              <div class="space-y-2.5">
                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase">Billing Email</label>
                  <input
                    type="email"
                    required
                    value="${state.user.email}"
                    class="w-full mt-1 p-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase">Card Holder Name</label>
                  <input
                    type="text"
                    required
                    value="${state.user.name}"
                    class="w-full mt-1 p-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-gray-500 uppercase">Secure Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="•••• •••• •••• ••••"
                    pattern="[0-9\\s]{13,19}"
                    class="w-full mt-1 p-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                class="w-full rounded-xl bg-gray-950 hover:bg-gray-800 text-white text-xs font-bold py-3.5 shadow-md transition-colors focus:outline-none text-center block mt-6"
              >
                Confirm Payment & Deliver Ebooks
              </button>
            </form>

          </div>

        </div>
      `
      }

    </div>
  `;
}

function renderDashboardHTML() {
  const library = state.user.library;

  return `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="dashboard-view-container">
      
      <!-- Top banner layout -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100 mb-8">
        
        <!-- User Metadata card -->
        <div class="flex items-center gap-4 text-left">
          <img
            src="${state.user.avatar}"
            alt="${state.user.name}"
            class="h-16 w-16 rounded-full border border-gray-200 object-cover"
          />
          <div>
            <div class="flex items-center gap-2">
              <h1 class="font-display text-2xl font-bold tracking-tight text-gray-900">${state.user.name}</h1>
              <span class="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest ${state.user.membership === "Pro" ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-gray-100 text-gray-600"}">
                ${state.user.membership} Edition
              </span>
            </div>
            <p class="text-xs text-gray-400 mt-0.5">${state.user.email} • Refined Reader</p>
          </div>
        </div>

        <!-- Membership upgrade trigger -->
        <div class="flex gap-2.5">
          <button
            onclick="window.app.upgradeMembership()"
            class="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none ${state.user.membership === "Pro" ? "bg-gray-100 text-gray-800 hover:bg-gray-200" : "bg-amber-400 text-gray-950 hover:bg-amber-300"}"
          >
            ${getIcon("Sparkles", "h-4 w-4")}
            ${state.user.membership === "Pro" ? "Revert to Standard" : "Upgrade to Pro Membership"}
          </button>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Interactive digital library (Left cols) -->
        <div class="lg:col-span-8 space-y-6">
          <h2 class="text-lg font-bold text-gray-900 text-left flex items-center gap-2">
            ${getIcon("Library", "h-5 w-5 text-amber-600")}
            Your Active Library
          </h2>

          ${
            library.length === 0
              ? `
            <div class="bg-white rounded-3xl border border-dashed border-gray-200 py-20 px-4 text-center">
              <span class="text-xs text-gray-400 font-mono">LIBRARY_EMPTY</span>
              <h3 class="font-display font-bold text-lg text-gray-900 mt-2">Your Digital Library is Empty</h3>
              <p class="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Acquire masterworks from our store to begin reading with absolute structural focus.
              </p>
              <button
                onclick="window.app.navigate('discover')"
                class="mt-6 rounded-xl bg-gray-950 px-5 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors focus:outline-none"
              >
                Acquire Your First Book
              </button>
            </div>
          `
              : `
            <div class="grid grid-cols-1 gap-4">
              ${library
                .map((item) => {
                  const book = state.books.find((b) => b.id === item.bookId);
                  if (!book) return "";
                  return `
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs text-left">
                    <div class="flex items-center gap-4">
                      <div class="h-20 w-14 overflow-hidden rounded bg-gray-50 shadow-xs flex-shrink-0">
                        <img src="${book.coverImage}" class="h-full w-full object-cover" />
                      </div>
                      
                      <div class="min-w-0">
                        <h3 class="font-display font-bold text-sm text-gray-900 truncate">${book.title}</h3>
                        <p class="text-xs text-gray-400">by ${book.author}</p>
                        
                        <!-- Visual Progress Slider -->
                        <div class="flex items-center gap-2 mt-2">
                          <div class="w-24 sm:w-36 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div class="bg-amber-500 h-full rounded-full" style="width: ${item.progress}%"></div>
                          </div>
                          <span class="text-[10px] font-bold font-mono text-gray-600">${item.progress}% Read</span>
                        </div>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-2 sm:self-center">
                      <button
                        onclick="window.app.selectBook('${book.id}')"
                        class="rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition-colors focus:outline-none"
                      >
                        Launch Reader
                      </button>
                      <button
                        onclick="alert('Digital specimen compiled successfully! Starting download for PDF and EPUB archives.');"
                        class="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none"
                        title="Download digital package files"
                      >
                        Offline Pack
                      </button>
                    </div>
                  </div>
                `;
                })
                .join("")}
            </div>
          `
          }
        </div>

        <!-- Orders & Billing History (Right cols) -->
        <div class="lg:col-span-4 space-y-6">
          <h2 class="text-lg font-bold text-gray-900 text-left">Order History</h2>
          
          <div class="space-y-3.5">
            ${state.orders
              .map(
                (order) => `
              <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-xs text-left space-y-3">
                <div class="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span class="text-xs font-bold font-mono text-gray-500">${order.id}</span>
                  <span class="rounded bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 uppercase">${order.status}</span>
                </div>
                
                <div class="space-y-1.5">
                  ${order.books
                    .map(
                      (b) => `
                    <div class="flex justify-between text-xs text-gray-600">
                      <span class="truncate pr-4">${b.title} (x${b.quantity})</span>
                      <span class="font-semibold text-gray-800">$${b.price}</span>
                    </div>
                  `,
                    )
                    .join("")}
                </div>

                <div class="flex justify-between pt-2 border-t border-gray-50 font-semibold text-xs text-gray-900">
                  <span>Total Spent</span>
                  <span>$${order.total.toFixed(2)}</span>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

      </div>

    </div>
  `;
}

function renderAdminHTML() {
  return `
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in" id="admin-view-container">
      
      <div class="text-left space-y-1 mb-8">
        <h1 class="font-display text-3xl font-bold tracking-tight text-gray-900">
          Admin Operations Portal
        </h1>
        <p class="text-sm text-gray-500">
          Modify the ebook inventory catalog, alter price points, and monitor sales metrics.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Firebase Integration Settings Panel -->
        <div class="lg:col-span-12 bg-white border border-gray-150 rounded-3xl p-6 shadow-xs text-left grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div class="space-y-4">
            <div class="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800">
              ${getIcon("ShieldCheck", "h-3.5 w-3.5 text-amber-700")}
              Firebase Cloud Integration
            </div>
            <h2 class="font-display text-xl font-bold text-gray-900 tracking-tight">
              Real-time Database & Authentication Sync
            </h2>
            <p class="text-xs text-gray-500 leading-relaxed">
              Enable Firebase to store and synchronize your books inventory, reviews, user profiles, carts, wishlists, and order history securely in the cloud.
            </p>
            
            <!-- Connection Status Badge -->
            <div class="flex items-center gap-3 pt-2">
              <span class="text-xs font-bold text-gray-600">Connection Status:</span>
              ${(() => {
                const fsStatus = getFirebaseStatus();
                if (fsStatus.status === "Connected") {
                  return `
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-850 text-xs font-bold px-3 py-1">
                      <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Connected
                    </span>
                  `;
                } else if (fsStatus.status === "Error") {
                  return `
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-250 text-red-850 text-xs font-bold px-3 py-1" title="${fsStatus.error}">
                      <span class="h-2 w-2 rounded-full bg-red-500"></span>
                      Initialization Error
                    </span>
                  `;
                } else {
                  return `
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-250 text-gray-700 text-xs font-bold px-3 py-1">
                      <span class="h-2 w-2 rounded-full bg-gray-405"></span>
                      Disconnected (Offline Mode)
                    </span>
                  `;
                }
              })()}
            </div>

            ${(() => {
              const fsStatus = getFirebaseStatus();
              if (fsStatus.status === "Connected") {
                return `
                  <div class="space-y-3 pt-4 border-t border-gray-100">
                    <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider">Cloud Operations</h4>
                    <div class="flex flex-wrap gap-2.5">
                      <button 
                        onclick="window.app.seedFirestoreAction()"
                        class="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs rounded-xl px-4 py-2.5 transition-colors focus:outline-none cursor-pointer"
                      >
                        ${getIcon("PlusCircle", "h-4 w-4")}
                        Seed Firestore Catalog
                      </button>
                      <button 
                        onclick="window.app.resetFirebaseConfigInApp()"
                        class="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl px-4 py-2.5 transition-colors focus:outline-none cursor-pointer"
                      >
                        ${getIcon("Trash2", "h-4 w-4")}
                        Reset Config
                      </button>
                    </div>
                  </div>
                `;
              } else {
                return "";
              }
            })()}
          </div>

          <!-- Firebase Config Form -->
          <form onsubmit="window.app.saveFirebaseConfigInApp(event)" class="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-3">
            <span class="block text-xs font-bold uppercase tracking-wider text-gray-400">Configure Credentials</span>
            
            <div class="grid grid-cols-2 gap-3 text-left">
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase">API Key</label>
                <input 
                  type="password" 
                  id="fb-api-key" 
                  placeholder="AIzaSy..." 
                  value="${state.firebaseConfigInput.apiKey || ""}"
                  required
                  class="w-full mt-1 p-2.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase">Project ID</label>
                <input 
                  type="text" 
                  id="fb-project-id" 
                  placeholder="lumina-books" 
                  value="${state.firebaseConfigInput.projectId || ""}"
                  required
                  class="w-full mt-1 p-2.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-left">
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase">Auth Domain</label>
                <input 
                  type="text" 
                  id="fb-auth-domain" 
                  placeholder="lumina-books.firebaseapp.com" 
                  value="${state.firebaseConfigInput.authDomain || ""}"
                  class="w-full mt-1 p-2.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase">Storage Bucket</label>
                <input 
                  type="text" 
                  id="fb-storage-bucket" 
                  placeholder="lumina-books.appspot.com" 
                  value="${state.firebaseConfigInput.storageBucket || ""}"
                  class="w-full mt-1 p-2.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-left">
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase">Messaging Sender ID</label>
                <input 
                  type="text" 
                  id="fb-messaging-sender-id" 
                  placeholder="987654321" 
                  value="${state.firebaseConfigInput.messagingSenderId || ""}"
                  class="w-full mt-1 p-2.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase">App ID</label>
                <input 
                  type="text" 
                  id="fb-app-id" 
                  placeholder="1:987:web:123" 
                  value="${state.firebaseConfigInput.appId || ""}"
                  class="w-full mt-1 p-2.5 rounded-lg border border-gray-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <button 
              type="submit" 
              class="w-full py-3 bg-gray-950 hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-colors focus:outline-none mt-2 cursor-pointer"
            >
              Save & Test Connection
            </button>
          </form>
        </div>

        <!-- Add Ebook Form (Left cols) -->
        <div class="lg:col-span-4 space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 text-left">
          <span class="block text-xs font-bold uppercase tracking-wider text-gray-400">Add Book To Inventory</span>
          
          <form onsubmit="window.app.addAdminBook(event)" class="space-y-3.5">
            <div>
              <label class="block text-[11px] font-bold text-gray-500 uppercase">Book Title</label>
              <input
                id="admin-title"
                type="text"
                required
                placeholder="The Architecture of Tomorrow"
                class="w-full mt-1 p-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-gray-500 uppercase">Author Name</label>
              <input
                id="admin-author"
                type="text"
                required
                placeholder="Dr. Christopher Wren"
                class="w-full mt-1 p-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold text-gray-500 uppercase">Genre</label>
                <select
                  id="admin-genre"
                  class="w-full mt-1 p-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none"
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Technology">Technology</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-gray-500 uppercase">Price ($)</label>
                <input
                  id="admin-price"
                  type="number"
                  step="0.01"
                  required
                  value="19.99"
                  class="w-full mt-1 p-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-gray-500 uppercase">Cover Art URL</label>
              <input
                id="admin-cover"
                type="url"
                value="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400"
                class="w-full mt-1 p-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none"
              />
            </div>

            ${(() => {
              if (getFirebaseStatus().status === "Connected") {
                return `
                  <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase">Cover Image File (Optional, overrides URL)</label>
                    <input
                      id="admin-cover-file"
                      type="file"
                      accept="image/*"
                      class="w-full mt-1 p-2 border border-gray-200 rounded-xl bg-white text-xs focus:outline-none"
                    />
                    <div id="admin-cover-progress" class="hidden mt-1.5">
                      <div class="w-full bg-gray-100 rounded-full h-1">
                        <div id="admin-cover-progress-bar" class="bg-amber-500 h-1 rounded-full" style="width: 0%"></div>
                      </div>
                      <span id="admin-cover-progress-text" class="text-[9px] font-semibold text-gray-400 mt-1 block font-mono">Uploading cover: 0%</span>
                    </div>
                  </div>

                  <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase">PDF Document File (Optional)</label>
                    <input
                      id="admin-pdf-file"
                      type="file"
                      accept="application/pdf"
                      class="w-full mt-1 p-2 border border-gray-200 rounded-xl bg-white text-xs focus:outline-none"
                    />
                    <div id="admin-pdf-progress" class="hidden mt-1.5">
                      <div class="w-full bg-gray-100 rounded-full h-1">
                        <div id="admin-pdf-progress-bar" class="bg-amber-500 h-1 rounded-full" style="width: 0%"></div>
                      </div>
                      <span id="admin-pdf-progress-text" class="text-[9px] font-semibold text-gray-400 mt-1 block font-mono">Uploading PDF: 0%</span>
                    </div>
                  </div>
                `;
              }
              return "";
            })()}

            <div>
              <label class="block text-[11px] font-bold text-gray-500 uppercase">Synopsis</label>
              <textarea
                id="admin-desc"
                rows="3"
                placeholder="Provide a short synopsis..."
                class="w-full mt-1 p-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              class="w-full rounded-xl bg-gray-950 hover:bg-gray-800 text-white text-xs font-bold py-3 transition-colors focus:outline-none"
            >
              Add Book To Catalog
            </button>
          </form>
        </div>

        <!-- Inventory List (Right cols) -->
        <div class="lg:col-span-8 space-y-6">
          
          <!-- Mock Sales Analytics visual (SVG based, extremely light, compliant with guidelines) -->
          <div class="bg-gray-900 rounded-2xl p-5 text-white text-left space-y-4 shadow-md">
            <div>
              <h3 class="text-sm font-bold uppercase tracking-wider text-amber-400">Inventory Distribution Analytics</h3>
              <p class="text-xs text-gray-400">Total Available Catalog value and distribution metrics represented dynamically.</p>
            </div>

            <!-- Beautiful dynamic responsive SVG chart representing Genre pricing trends -->
            <div class="w-full h-32 flex items-end justify-between pt-4">
              ${[
                { label: "Phil", height: 75, count: 5, color: "#10b981" },
                { label: "Tech", height: 60, count: 4, color: "#6366f1" },
                { label: "Design", height: 90, count: 6, color: "#f59e0b" },
                { label: "Fict", height: 45, count: 3, color: "#ec4899" },
                { label: "Bus", height: 35, count: 2, color: "#3b82f6" },
              ]
                .map(
                  (item) => `
                <div class="flex flex-col items-center flex-1 space-y-2">
                  <div class="text-[10px] font-mono font-bold text-gray-300">${item.count} items</div>
                  <div class="w-8 rounded-t transition-all duration-500" style="height: ${item.height}px; background-color: ${item.color}"></div>
                  <div class="text-[10px] font-semibold text-gray-400 font-mono">${item.label}</div>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>

          <h2 class="text-lg font-bold text-gray-900 text-left">Active Book Inventory</h2>
          
          <div class="space-y-2.5">
            ${state.books
              .map(
                (book) => `
              <div class="flex items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-xs text-left">
                <div class="flex items-center gap-3 min-w-0">
                  <img src="${book.coverImage}" class="h-10 w-7 rounded object-cover shadow-xs" />
                  <div class="min-w-0">
                    <h4 class="font-display font-bold text-xs text-gray-900 truncate">${book.title}</h4>
                    <p class="text-[10px] text-gray-400">by ${book.author} • <span class="uppercase">${book.genre}</span></p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold font-mono text-gray-900">$${book.price.toFixed(2)}</span>
                  <button
                    onclick="window.app.deleteAdminBook('${book.id}')"
                    class="p-2 text-gray-400 hover:text-red-600 transition-colors focus:outline-none"
                    title="Remove book"
                  >
                    ${getIcon("Trash2", "h-4 w-4")}
                  </button>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

      </div>

    </div>
  `;
}

function renderFooterHTML() {
  return `
    <footer class="bg-gray-950 text-gray-400 py-12 border-t border-gray-900 mt-16 text-left">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-950">
              ${getIcon("BookOpen", "h-4.5 w-4.5")}
            </div>
            <span class="font-display font-bold text-white tracking-wider text-sm">LUMINA BOOKS</span>
          </div>
          <p class="text-xs text-gray-500 leading-relaxed">
            A premium digital marketplace and interactive digital e-reading repository designed with architectural honesty.
          </p>
        </div>

        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-white mb-4">Editorial Collections</h4>
          <ul class="space-y-2 text-xs">
            <li><button onclick="window.app.navigate('discover', 'Philosophy')" class="hover:text-amber-400 focus:outline-none transition-colors">Philosophy Specimen</button></li>
            <li><button onclick="window.app.navigate('discover', 'Technology')" class="hover:text-amber-400 focus:outline-none transition-colors">Technology Systems</button></li>
            <li><button onclick="window.app.navigate('discover', 'Design')" class="hover:text-amber-400 focus:outline-none transition-colors">Design & Swiss Grid</button></li>
            <li><button onclick="window.app.navigate('discover', 'Fiction')" class="hover:text-amber-400 focus:outline-none transition-colors">Fiction & Speculations</button></li>
          </ul>
        </div>

        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-white mb-4">Refined Tools</h4>
          <ul class="space-y-2 text-xs">
            <li><button onclick="window.app.navigate('dashboard')" class="hover:text-amber-400 focus:outline-none transition-colors">Secure Library</button></li>
            <li><button onclick="window.app.navigate('checkout')" class="hover:text-amber-400 focus:outline-none transition-colors">Checkout Portal</button></li>
            <li><button onclick="window.app.navigate('admin')" class="hover:text-amber-400 focus:outline-none transition-colors">Admin Dashboard</button></li>
            <li><button onclick="window.app.navigate('wishlist')" class="hover:text-amber-400 focus:outline-none transition-colors">Bookmarked Treasures</button></li>
          </ul>
        </div>

        <div class="space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-white">Lumina Registry</h4>
          <p class="text-xs text-gray-500">
            Secure offline e-reader integrations and distributed licensing protocols active.
          </p>
          <div class="text-[10px] font-mono text-gray-600">
            LUM-NODE-ACTIVE: v4.21.2
          </div>
        </div>
      </div>

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>&copy; ${new Date().getFullYear()} Lumina Books Inc. All digital rights reserved.</p>
        <div class="flex gap-4">
          <span class="hover:text-white transition-colors cursor-pointer">Security Audits</span>
          <span>•</span>
          <span class="hover:text-white transition-colors cursor-pointer">Licensing Terms</span>
          <span>•</span>
          <span class="hover:text-white transition-colors cursor-pointer">Workspace Sync</span>
        </div>
      </div>
    </footer>
  `;
}

function renderAuthModalHTML() {
  if (!state.showAuthModal) return "";
  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm animate-fade-in" id="auth-modal-overlay">
      <div class="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-150 shadow-2xl relative text-left space-y-6">
        <!-- Close button -->
        <button 
          onclick="window.app.closeAuthModal()"
          class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors focus:outline-none cursor-pointer"
        >
          ${getIcon("X", "h-5 w-5")}
        </button>

        <div class="space-y-1">
          <h2 class="font-display text-xl font-bold tracking-tight text-gray-900">
            ${state.authMode === "login" ? "Sign In to Lumina" : "Create Lumina Account"}
          </h2>
          <p class="text-xs text-gray-500">
            ${state.authMode === "login" ? "Access your high-fidelity reading vault and settings" : "Join the bookstore and sync your library across devices"}
          </p>
        </div>

        ${state.authError ? `
          <div class="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-semibold">
            ${state.authError}
          </div>
        ` : ""}

        <form onsubmit="${state.authMode === "login" ? "window.app.handleLogin(event)" : "window.app.handleSignup(event)"}" class="space-y-4">
          ${state.authMode === "signup" ? `
            <div>
              <label class="block text-[11px] font-bold text-gray-500 uppercase">Display Name</label>
              <input 
                type="text" 
                id="auth-name" 
                required 
                placeholder="Alex Mercer"
                class="w-full mt-1.5 p-3 text-sm rounded-xl border border-gray-255 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
              />
            </div>
          ` : ""}

          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase">Email Address</label>
            <input 
              type="email" 
              id="auth-email" 
              required 
              placeholder="alex@lumina.io"
              class="w-full mt-1.5 p-3 text-sm rounded-xl border border-gray-255 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-gray-500 uppercase">Password</label>
            <input 
              type="password" 
              id="auth-password" 
              required 
              placeholder="••••••••"
              minlength="6"
              class="w-full mt-1.5 p-3 text-sm rounded-xl border border-gray-255 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
            />
          </div>

          <button 
            type="submit"
            class="w-full py-3 bg-gray-950 hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-colors focus:outline-none shadow-md mt-6 cursor-pointer"
          >
            ${state.authMode === "login" ? "Log In" : "Register Account"}
          </button>
        </form>

        <div class="text-center pt-2">
          <button 
            onclick="window.app.openAuthModal('${state.authMode === "login" ? "signup" : "login"}')"
            class="text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors focus:outline-none cursor-pointer"
          >
            ${state.authMode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  `;
}

// Start execution
controller.initFirebaseSync();

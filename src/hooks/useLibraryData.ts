
import { useState, useEffect } from "react";

export interface Book {
  id: string;
  title: string;
  authorId: string;
  publishedDate: string;
  isbn: string;
  availableCopies: number;
  totalCopies: number;
  genre?: string;
  description?: string;
}

export interface Author {
  id: string;
  name: string;
  biography: string;
  birthDate?: string;
  nationality?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  borrowedBooks: string[];
  joinDate: string;
  membershipType: 'basic' | 'premium';
}

export interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
}

// Enhanced mock data
const initialBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    authorId: "1",
    publishedDate: "1925-04-10",
    isbn: "978-0-7432-7356-5",
    availableCopies: 5,
    totalCopies: 8,
    genre: "Fiction",
    description: "A classic American novel set in the Jazz Age."
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    authorId: "2",
    publishedDate: "1960-07-11",
    isbn: "978-0-06-112008-4",
    availableCopies: 3,
    totalCopies: 6,
    genre: "Fiction",
    description: "A gripping tale of racial injustice and childhood innocence."
  },
  {
    id: "3",
    title: "1984",
    authorId: "3",
    publishedDate: "1949-06-08",
    isbn: "978-0-452-28423-4",
    availableCopies: 7,
    totalCopies: 10,
    genre: "Dystopian Fiction",
    description: "A dystopian social science fiction novel."
  },
];

const initialAuthors: Author[] = [
  {
    id: "1",
    name: "F. Scott Fitzgerald",
    biography: "American novelist and short story writer, known for his novels depicting the flamboyance and excess of the Jazz Age.",
    birthDate: "1896-09-24",
    nationality: "American"
  },
  {
    id: "2",
    name: "Harper Lee",
    biography: "American novelist widely known for To Kill a Mockingbird, published in 1960.",
    birthDate: "1926-04-28",
    nationality: "American"
  },
  {
    id: "3",
    name: "George Orwell",
    biography: "English novelist and essayist, journalist and critic, whose work is marked by lucid prose, awareness of social injustice.",
    birthDate: "1903-06-25",
    nationality: "British"
  },
];

const initialUsers: User[] = [
  {
    id: "1",
    username: "john_doe",
    email: "john.doe@email.com",
    borrowedBooks: ["1"],
    joinDate: "2023-01-15",
    membershipType: "premium"
  },
  {
    id: "2",
    username: "jane_smith",
    email: "jane.smith@email.com",
    borrowedBooks: ["2", "3"],
    joinDate: "2023-03-22",
    membershipType: "basic"
  },
];

const initialBorrowRecords: BorrowRecord[] = [
  {
    id: "1",
    userId: "1",
    bookId: "1",
    borrowDate: "2024-06-01",
    dueDate: "2024-06-15",
    status: "borrowed"
  },
  {
    id: "2",
    userId: "2",
    bookId: "2",
    borrowDate: "2024-05-20",
    dueDate: "2024-06-03",
    status: "borrowed"
  },
];

export const useLibraryData = () => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(initialBorrowRecords);

  // CRUD operations for Books
  const addBook = (book: Omit<Book, "id">) => {
    const newBook = { ...book, id: Date.now().toString() };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (id: string, updatedBook: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, ...updatedBook } : book
    ));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  // CRUD operations for Authors
  const addAuthor = (author: Omit<Author, "id">) => {
    const newAuthor = { ...author, id: Date.now().toString() };
    setAuthors(prev => [...prev, newAuthor]);
  };

  const updateAuthor = (id: string, updatedAuthor: Partial<Author>) => {
    setAuthors(prev => prev.map(author => 
      author.id === id ? { ...author, ...updatedAuthor } : author
    ));
  };

  const deleteAuthor = (id: string) => {
    setAuthors(prev => prev.filter(author => author.id !== id));
  };

  // CRUD operations for Users
  const addUser = (user: Omit<User, "id" | "joinDate">) => {
    const newUser = { 
      ...user, 
      id: Date.now().toString(),
      joinDate: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updatedUser: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updatedUser } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  // Enhanced search functions
  const searchBooks = (query: string) => {
    return books.filter(book => 
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.isbn.includes(query) ||
      book.genre?.toLowerCase().includes(query.toLowerCase()) ||
      authors.find(author => author.id === book.authorId)?.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const searchAuthors = (query: string) => {
    return authors.filter(author =>
      author.name.toLowerCase().includes(query.toLowerCase()) ||
      author.nationality?.toLowerCase().includes(query.toLowerCase())
    );
  };

  const searchUsers = (query: string) => {
    return users.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Book borrowing and returning functions
  const borrowBook = (userId: string, bookId: string) => {
    const book = books.find(b => b.id === bookId);
    const user = users.find(u => u.id === userId);
    
    if (!book || !user || book.availableCopies <= 0) {
      return false;
    }

    // Update book availability
    setBooks(prev => prev.map(b => 
      b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b
    ));

    // Update user's borrowed books
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, borrowedBooks: [...u.borrowedBooks, bookId] } : u
    ));

    // Create borrow record
    const newRecord: BorrowRecord = {
      id: Date.now().toString(),
      userId,
      bookId,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'borrowed'
    };
    setBorrowRecords(prev => [...prev, newRecord]);

    return true;
  };

  const returnBook = (userId: string, bookId: string) => {
    const user = users.find(u => u.id === userId);
    
    if (!user || !user.borrowedBooks.includes(bookId)) {
      return false;
    }

    // Update book availability
    setBooks(prev => prev.map(b => 
      b.id === bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b
    ));

    // Update user's borrowed books
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, borrowedBooks: u.borrowedBooks.filter(id => id !== bookId) } : u
    ));

    // Update borrow record
    setBorrowRecords(prev => prev.map(record => 
      record.userId === userId && record.bookId === bookId && record.status === 'borrowed'
        ? { ...record, returnDate: new Date().toISOString().split('T')[0], status: 'returned' }
        : record
    ));

    return true;
  };

  // Statistics functions
  const getLibraryStats = () => {
    const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
    const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
    const borrowedBooks = totalBooks - availableBooks;
    const totalAuthors = authors.length;
    const totalUsers = users.length;
    const activeLoans = borrowRecords.filter(record => record.status === 'borrowed').length;

    return {
      totalBooks,
      availableBooks,
      borrowedBooks,
      totalAuthors,
      totalUsers,
      activeLoans
    };
  };

  const getMostPopularBooks = () => {
    const bookBorrowCount = borrowRecords.reduce((acc, record) => {
      acc[record.bookId] = (acc[record.bookId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return books
      .map(book => ({
        ...book,
        borrowCount: bookBorrowCount[book.id] || 0
      }))
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 5);
  };

  const getOverdueBooks = () => {
    const today = new Date().toISOString().split('T')[0];
    return borrowRecords
      .filter(record => record.status === 'borrowed' && record.dueDate < today)
      .map(record => {
        const book = books.find(b => b.id === record.bookId);
        const user = users.find(u => u.id === record.userId);
        return { ...record, book, user };
      });
  };

  const getUserBorrowHistory = (userId: string) => {
    return borrowRecords
      .filter(record => record.userId === userId)
      .map(record => {
        const book = books.find(b => b.id === record.bookId);
        return { ...record, book };
      })
      .sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime());
  };

  const getBooksByGenre = () => {
    const genreCount = books.reduce((acc, book) => {
      const genre = book.genre || 'Unknown';
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(genreCount).map(([genre, count]) => ({ genre, count }));
  };

  // Filter functions
  const filterBooksByAvailability = (available: boolean) => {
    return books.filter(book => available ? book.availableCopies > 0 : book.availableCopies === 0);
  };

  const filterBooksByGenre = (genre: string) => {
    return books.filter(book => book.genre === genre);
  };

  const filterUsersByMembership = (membershipType: 'basic' | 'premium') => {
    return users.filter(user => user.membershipType === membershipType);
  };

  return {
    // Data
    books,
    authors,
    users,
    borrowRecords,
    
    // CRUD operations
    addBook,
    updateBook,
    deleteBook,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    addUser,
    updateUser,
    deleteUser,
    
    // Search functions
    searchBooks,
    searchAuthors,
    searchUsers,
    
    // Borrowing functions
    borrowBook,
    returnBook,
    
    // Statistics and analytics
    getLibraryStats,
    getMostPopularBooks,
    getOverdueBooks,
    getUserBorrowHistory,
    getBooksByGenre,
    
    // Filter functions
    filterBooksByAvailability,
    filterBooksByGenre,
    filterUsersByMembership,
  };
};

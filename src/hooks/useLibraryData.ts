
import { useState, useEffect } from "react";

export interface Book {
  id: string;
  title: string;
  authorId: string;
  publishedDate: string;
  isbn: string;
  availableCopies: number;
}

export interface Author {
  id: string;
  name: string;
  biography: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  borrowedBooks: string[];
}

// Mock data for demonstration
const initialBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    authorId: "1",
    publishedDate: "1925-04-10",
    isbn: "978-0-7432-7356-5",
    availableCopies: 5,
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    authorId: "2",
    publishedDate: "1960-07-11",
    isbn: "978-0-06-112008-4",
    availableCopies: 3,
  },
  {
    id: "3",
    title: "1984",
    authorId: "3",
    publishedDate: "1949-06-08",
    isbn: "978-0-452-28423-4",
    availableCopies: 7,
  },
];

const initialAuthors: Author[] = [
  {
    id: "1",
    name: "F. Scott Fitzgerald",
    biography: "American novelist and short story writer, known for his novels depicting the flamboyance and excess of the Jazz Age.",
  },
  {
    id: "2",
    name: "Harper Lee",
    biography: "American novelist widely known for To Kill a Mockingbird, published in 1960.",
  },
  {
    id: "3",
    name: "George Orwell",
    biography: "English novelist and essayist, journalist and critic, whose work is marked by lucid prose, awareness of social injustice.",
  },
];

const initialUsers: User[] = [
  {
    id: "1",
    username: "john_doe",
    email: "john.doe@email.com",
    borrowedBooks: ["1"],
  },
  {
    id: "2",
    username: "jane_smith",
    email: "jane.smith@email.com",
    borrowedBooks: ["2", "3"],
  },
];

export const useLibraryData = () => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
  const [users, setUsers] = useState<User[]>(initialUsers);

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
  const addUser = (user: Omit<User, "id">) => {
    const newUser = { ...user, id: Date.now().toString() };
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

  return {
    books,
    authors,
    users,
    addBook,
    updateBook,
    deleteBook,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    addUser,
    updateUser,
    deleteUser,
  };
};

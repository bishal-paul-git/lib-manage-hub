
import { useState } from "react";
import { Plus, Search, Edit, Trash2, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLibraryData } from "@/hooks/useLibraryData";
import { BookForm } from "@/components/BookForm";
import { useToast } from "@/hooks/use-toast";

export const BooksManager = () => {
  const { books, authors, deleteBook } = useLibraryData();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const { toast } = useToast();

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  const handleDelete = (id: string, title: string) => {
    deleteBook(id);
    toast({
      title: "Book deleted",
      description: `"${title}" has been removed from the library.`,
    });
  };

  const handleEdit = (book: any) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Books Management</h2>
          <p className="text-gray-600">Manage your library's book collection</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search books by title or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => {
          const author = authors.find(a => a.id === book.authorId);
          return (
            <Card key={book.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Book className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{book.title}</CardTitle>
                      <p className="text-sm text-gray-600">{author?.name || 'Unknown Author'}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(book)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(book.id, book.title)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ISBN:</span>
                    <span className="font-mono">{book.isbn}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Published:</span>
                    <span>{new Date(book.publishedDate).getFullYear()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-semibold text-green-600">{book.availableCopies} copies</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No books found. Try adjusting your search terms.</p>
        </div>
      )}

      {showForm && (
        <BookForm
          book={editingBook}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};


import { useState } from "react";
import { Search, Book, User, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLibraryData } from "@/hooks/useLibraryData";
import { useToast } from "@/hooks/use-toast";

export const BorrowingManager = () => {
  const { 
    books, 
    users, 
    authors,
    borrowBook, 
    returnBook, 
    getOverdueBooks, 
    getUserBorrowHistory,
    filterBooksByAvailability 
  } = useLibraryData();
  
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"borrow" | "return" | "overdue">("borrow");
  const { toast } = useToast();

  const availableBooks = filterBooksByAvailability(true);
  const overdueBooks = getOverdueBooks();

  const handleBorrowBook = () => {
    if (!selectedUser || !selectedBook) {
      toast({
        title: "Error",
        description: "Please select both a user and a book.",
        variant: "destructive",
      });
      return;
    }

    const success = borrowBook(selectedUser, selectedBook);
    if (success) {
      const book = books.find(b => b.id === selectedBook);
      const user = users.find(u => u.id === selectedUser);
      toast({
        title: "Book borrowed successfully",
        description: `"${book?.title}" has been borrowed by ${user?.username}.`,
      });
      setSelectedBook("");
      setSelectedUser("");
    } else {
      toast({
        title: "Error",
        description: "Unable to borrow book. Please check availability.",
        variant: "destructive",
      });
    }
  };

  const handleReturnBook = (userId: string, bookId: string) => {
    const success = returnBook(userId, bookId);
    if (success) {
      const book = books.find(b => b.id === bookId);
      const user = users.find(u => u.id === userId);
      toast({
        title: "Book returned successfully",
        description: `"${book?.title}" has been returned by ${user?.username}.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Unable to return book.",
        variant: "destructive",
      });
    }
  };

  const getBorrowedBooksByUser = () => {
    return users.map(user => {
      const borrowedBooks = user.borrowedBooks.map(bookId => 
        books.find(book => book.id === bookId)
      ).filter(Boolean);
      return { user, borrowedBooks };
    }).filter(item => item.borrowedBooks.length > 0);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Borrowing Management</h2>
          <p className="text-gray-600">Manage book borrowing and returns</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "borrow" ? "default" : "ghost"}
          onClick={() => setActiveTab("borrow")}
          size="sm"
        >
          Borrow Books
        </Button>
        <Button
          variant={activeTab === "return" ? "default" : "ghost"}
          onClick={() => setActiveTab("return")}
          size="sm"
        >
          Return Books
        </Button>
        <Button
          variant={activeTab === "overdue" ? "default" : "ghost"}
          onClick={() => setActiveTab("overdue")}
          size="sm"
        >
          Overdue ({overdueBooks.length})
        </Button>
      </div>

      {activeTab === "borrow" && (
        <div className="space-y-6">
          {/* Borrow Book Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Borrow Book
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select User</label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.username} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Book</label>
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a book" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBooks.map((book) => {
                        const author = authors.find(a => a.id === book.authorId);
                        return (
                          <SelectItem key={book.id} value={book.id}>
                            {book.title} by {author?.name} ({book.availableCopies} available)
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleBorrowBook} className="w-full">
                Borrow Book
              </Button>
            </CardContent>
          </Card>

          {/* Available Books */}
          <Card>
            <CardHeader>
              <CardTitle>Available Books ({availableBooks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableBooks.slice(0, 6).map((book) => {
                  const author = authors.find(a => a.id === book.authorId);
                  return (
                    <div key={book.id} className="p-4 border rounded-lg">
                      <h3 className="font-medium">{book.title}</h3>
                      <p className="text-sm text-gray-600">by {author?.name}</p>
                      <Badge className="mt-2">
                        {book.availableCopies} available
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "return" && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-4">
            {getBorrowedBooksByUser().map(({ user, borrowedBooks }) => (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {user.username}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {borrowedBooks.map((book) => {
                      if (!book) return null;
                      const author = authors.find(a => a.id === book.authorId);
                      return (
                        <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium">{book.title}</p>
                            <p className="text-sm text-gray-600">by {author?.name}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleReturnBook(user.id, book.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Return
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "overdue" && (
        <div className="space-y-4">
          {overdueBooks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium">No overdue books!</p>
                <p className="text-gray-600">All books are returned on time.</p>
              </CardContent>
            </Card>
          ) : (
            overdueBooks.map((record) => (
              <Card key={record.id} className="border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">{record.book?.title}</p>
                        <p className="text-sm text-gray-600">
                          Borrowed by: {record.user?.username}
                        </p>
                        <p className="text-sm text-red-600">
                          Due: {record.dueDate}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleReturnBook(record.userId, record.bookId)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Return
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

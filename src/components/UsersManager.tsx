
import { useState } from "react";
import { Plus, Search, Edit, Trash2, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLibraryData } from "@/hooks/useLibraryData";
import { UserForm } from "@/components/UserForm";
import { useToast } from "@/hooks/use-toast";

export const UsersManager = () => {
  const { users, books, deleteUser } = useLibraryData();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { toast } = useToast();

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBorrowedBooksInfo = (borrowedBookIds: string[]) => {
    return borrowedBookIds.map(bookId => 
      books.find(book => book.id === bookId)?.title || 'Unknown Book'
    );
  };

  const handleDelete = (id: string, username: string) => {
    const user = users.find(u => u.id === id);
    if (user && user.borrowedBooks.length > 0) {
      toast({
        title: "Cannot delete user",
        description: `${username} has ${user.borrowedBooks.length} borrowed book(s). Return them first.`,
        variant: "destructive",
      });
      return;
    }
    
    deleteUser(id);
    toast({
      title: "User deleted",
      description: `${username} has been removed from the system.`,
    });
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Users Management</h2>
          <p className="text-gray-600">Manage library users and their activities</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const borrowedBooks = getBorrowedBooksInfo(user.borrowedBooks);
          return (
            <Card key={user.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.username}</CardTitle>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(user.id, user.username)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Borrowed Books ({user.borrowedBooks.length})
                  </p>
                  {borrowedBooks.length > 0 ? (
                    <div className="space-y-1">
                      {borrowedBooks.map((bookTitle, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {bookTitle}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No books currently borrowed</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No users found. Try adjusting your search terms.</p>
        </div>
      )}

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

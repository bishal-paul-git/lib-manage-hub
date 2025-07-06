
import { useState } from "react";
import { Plus, Search, Edit, Trash2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLibraryData } from "@/hooks/useLibraryData";
import { AuthorForm } from "@/components/AuthorForm";
import { useToast } from "@/hooks/use-toast";

export const AuthorsManager = () => {
  const { authors, books, deleteAuthor } = useLibraryData();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const { toast } = useToast();

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAuthorBookCount = (authorId: string) => {
    return books.filter(book => book.authorId === authorId).length;
  };

  const handleDelete = (id: string, name: string) => {
    const bookCount = getAuthorBookCount(id);
    if (bookCount > 0) {
      toast({
        title: "Cannot delete author",
        description: `${name} has ${bookCount} book(s) in the library. Remove their books first.`,
        variant: "destructive",
      });
      return;
    }
    
    deleteAuthor(id);
    toast({
      title: "Author deleted",
      description: `${name} has been removed from the system.`,
    });
  };

  const handleEdit = (author: any) => {
    setEditingAuthor(author);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAuthor(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Authors Management</h2>
          <p className="text-gray-600">Manage authors in your library system</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Author
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search authors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthors.map((author) => {
          const bookCount = getAuthorBookCount(author.id);
          return (
            <Card key={author.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <UserCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{author.name}</CardTitle>
                      <p className="text-sm text-gray-600">{bookCount} book(s)</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(author)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(author.id, author.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {author.biography || "No biography available."}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAuthors.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No authors found. Try adjusting your search terms.</p>
        </div>
      )}

      {showForm && (
        <AuthorForm
          author={editingAuthor}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

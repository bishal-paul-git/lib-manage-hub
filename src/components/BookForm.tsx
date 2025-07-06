
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLibraryData, Book } from "@/hooks/useLibraryData";
import { useToast } from "@/hooks/use-toast";

interface BookFormProps {
  book?: Book | null;
  onClose: () => void;
}

export const BookForm = ({ book, onClose }: BookFormProps) => {
  const { authors, addBook, updateBook } = useLibraryData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: book?.title || "",
    authorId: book?.authorId || "",
    publishedDate: book?.publishedDate || "",
    isbn: book?.isbn || "",
    availableCopies: book?.availableCopies || 1,
    totalCopies: book?.totalCopies || 1,
    genre: book?.genre || "",
    description: book?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.authorId || !formData.isbn) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (book) {
      updateBook(book.id, formData);
      toast({
        title: "Book updated",
        description: `"${formData.title}" has been updated successfully.`,
      });
    } else {
      addBook(formData);
      toast({
        title: "Book added",
        description: `"${formData.title}" has been added to the library.`,
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{book ? "Edit Book" : "Add New Book"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter book title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="author">Author *</Label>
            <Select
              value={formData.authorId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, authorId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an author" />
              </SelectTrigger>
              <SelectContent>
                {authors.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    {author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="isbn">ISBN *</Label>
            <Input
              id="isbn"
              value={formData.isbn}
              onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
              placeholder="978-0-00-000000-0"
              required
            />
          </div>

          <div>
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
              placeholder="Fiction, Non-fiction, etc."
            />
          </div>

          <div>
            <Label htmlFor="publishedDate">Published Date</Label>
            <Input
              id="publishedDate"
              type="date"
              value={formData.publishedDate}
              onChange={(e) => setFormData(prev => ({ ...prev, publishedDate: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalCopies">Total Copies</Label>
              <Input
                id="totalCopies"
                type="number"
                min="1"
                value={formData.totalCopies}
                onChange={(e) => setFormData(prev => ({ ...prev, totalCopies: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <Label htmlFor="copies">Available Copies</Label>
              <Input
                id="copies"
                type="number"
                min="0"
                max={formData.totalCopies}
                value={formData.availableCopies}
                onChange={(e) => setFormData(prev => ({ ...prev, availableCopies: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the book"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
              {book ? "Update" : "Add"} Book
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLibraryData, Author } from "@/hooks/useLibraryData";
import { useToast } from "@/hooks/use-toast";

interface AuthorFormProps {
  author?: Author | null;
  onClose: () => void;
}

export const AuthorForm = ({ author, onClose }: AuthorFormProps) => {
  const { addAuthor, updateAuthor } = useLibraryData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: author?.name || "",
    biography: author?.biography || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Author name is required.",
        variant: "destructive",
      });
      return;
    }

    if (author) {
      updateAuthor(author.id, formData);
      toast({
        title: "Author updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      addAuthor(formData);
      toast({
        title: "Author added",
        description: `${formData.name} has been added to the system.`,
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{author ? "Edit Author" : "Add New Author"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter author name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="biography">Biography</Label>
            <Textarea
              id="biography"
              value={formData.biography}
              onChange={(e) => setFormData(prev => ({ ...prev, biography: e.target.value }))}
              placeholder="Enter author biography..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {author ? "Update" : "Add"} Author
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

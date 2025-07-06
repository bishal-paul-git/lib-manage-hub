
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLibraryData, User } from "@/hooks/useLibraryData";
import { useToast } from "@/hooks/use-toast";

interface UserFormProps {
  user?: User | null;
  onClose: () => void;
}

export const UserForm = ({ user, onClose }: UserFormProps) => {
  const { addUser, updateUser } = useLibraryData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    borrowedBooks: user?.borrowedBooks || [],
    membershipType: user?.membershipType || 'basic' as 'basic' | 'premium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.email.trim()) {
      toast({
        title: "Error",
        description: "Username and email are required.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (user) {
      updateUser(user.id, formData);
      toast({
        title: "User updated",
        description: `${formData.username} has been updated successfully.`,
      });
    } else {
      addUser(formData);
      toast({
        title: "User added",
        description: `${formData.username} has been added to the system.`,
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter username"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <Label htmlFor="membershipType">Membership Type</Label>
            <Select
              value={formData.membershipType}
              onValueChange={(value: 'basic' | 'premium') => setFormData(prev => ({ ...prev, membershipType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select membership type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {user ? "Update" : "Add"} User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

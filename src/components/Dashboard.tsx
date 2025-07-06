
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLibraryData } from "@/hooks/useLibraryData";
import { Book, Users, UserCheck, AlertTriangle, TrendingUp, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from "recharts";

export const Dashboard = () => {
  const { 
    getLibraryStats, 
    getMostPopularBooks, 
    getOverdueBooks, 
    getBooksByGenre,
    authors 
  } = useLibraryData();

  const stats = getLibraryStats();
  const popularBooks = getMostPopularBooks();
  const overdueBooks = getOverdueBooks();
  const genreData = getBooksByGenre();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Library Dashboard</h2>
        <p className="text-gray-600">Overview of your library management system</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Book className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableBooks} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Authors</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAuthors}</div>
            <p className="text-xs text-muted-foreground">
              {authors.filter(a => a.nationality === 'American').length} American
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeLoans} active loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Borrowed</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.borrowedBooks}</div>
            <p className="text-xs text-muted-foreground">
              {overdueBooks.length} overdue
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular Books */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Most Popular Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularBooks}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="title" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="borrowCount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Books by Genre */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Books by Genre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({genre, count}) => `${genre}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Books Alert */}
      {overdueBooks.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Overdue Books ({overdueBooks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueBooks.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <p className="font-medium">{record.book?.title}</p>
                    <p className="text-sm text-gray-600">Borrowed by: {record.user?.username}</p>
                  </div>
                  <Badge variant="destructive">
                    Due: {record.dueDate}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <Book className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="font-medium">Add New Book</p>
              <p className="text-sm text-gray-600">Expand your collection</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium">Register Author</p>
              <p className="text-sm text-gray-600">Add new authors</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="font-medium">Add New User</p>
              <p className="text-sm text-gray-600">Register new members</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

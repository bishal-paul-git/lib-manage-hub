
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLibraryData } from "@/hooks/useLibraryData";
import { Book, Users, UserCheck, AlertTriangle, TrendingUp, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from "recharts";

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
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-lg border border-amber-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">SIU Library Dashboard</h2>
        <p className="text-gray-700">Sylhet International University - Library Management System</p>
        <p className="text-sm text-gray-600 mt-1">Real-time overview of library operations and statistics</p>
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
              {stats.availableBooks} available for students
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
              {authors.filter(a => a.nationality === 'American').length} American authors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Students</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeLoans} active borrowers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Issued</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.borrowedBooks}</div>
            <p className="text-xs text-muted-foreground">
              {overdueBooks.length} overdue returns
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
              Most Popular Books Among Students
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
              Collection Distribution by Genre
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
              Overdue Returns Alert ({overdueBooks.length} books)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueBooks.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <p className="font-medium">{record.book?.title}</p>
                    <p className="text-sm text-gray-600">Student: {record.user?.username}</p>
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Library Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <Book className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="font-medium">Add New Book</p>
              <p className="text-sm text-gray-600">Expand SIU collection</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium">Register Author</p>
              <p className="text-sm text-gray-600">Add new authors</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="font-medium">Register Student</p>
              <p className="text-sm text-gray-600">Add new SIU students</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

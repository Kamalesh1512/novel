"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreHorizontal,
  Search,
  Star,
  CheckCircle,
  Loader2,
  Eye,
  Trash2,
  ShieldCheck,
  ShieldX,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/global/loading";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verified: boolean;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  } | null;
  product: {
    id: string;
    name: string;
    sku: string;
  } | null;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [searchTerm]);

  const fetchReviews = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/admin/reviews?${params}`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Error", {
        description: "Failed to fetch reviews",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToggle = async (
    reviewId: string,
    currentVerified: boolean
  ) => {
    setActionLoading(reviewId);
    try {
      const response = await fetch(`/api/admin/reviews?id=${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verified: !currentVerified }),
      });

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      const result = await response.json();

      // Update the local state
      setReviews(
        reviews.map((review) =>
          review.id === reviewId
            ? { ...review, verified: !currentVerified }
            : review
        )
      );

      toast.success("Success", {
        description: result.message,
      });
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Error", {
        description: "Failed to update review verification status",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setActionLoading(reviewId);
    try {
      const response = await fetch(`/api/admin/reviews?id=${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      const result = await response.json();

      // Remove from local state
      setReviews(reviews.filter((review) => review.id !== reviewId));

      toast.success("Success", {
        description: result.message,
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error", {
        description: "Failed to delete review",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReplySubmit = async () => {
    if (!selectedReview || !replyText.trim()) return;

    // Here you would implement the reply functionality
    // For now, we'll just show a toast
    toast.error("Reply Sent", {
      description: "Your reply has been sent to the customer",
    });

    setReplyText("");
    setSelectedReview(null);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return ( <LoadingScreen description="reviews"/>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">
            Manage customer reviews and feedback.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>
            Monitor and moderate product reviews from your customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          {/* Table View - visible on medium and larger screens */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="/placeholder.svg"
                            alt={review.customer?.name}
                          />
                          <AvatarFallback>
                            {review.customer?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {review.customer?.name || "Unknown"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {review.customer?.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {review.product?.name || "Unknown Product"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {review.product?.sku}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell className="max-w-xs">
                      {review.title && (
                        <div className="font-medium mb-1">{review.title}</div>
                      )}
                      <div className="text-sm text-muted-foreground truncate">
                        {review.comment || "No comment"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={review.verified ? "default" : "secondary"}
                        >
                          {review.verified ? "Verified" : "Unverified"}
                        </Badge>
                        {review.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(review.createdAt).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            disabled={actionLoading === review.id}
                          >
                            {actionLoading === review.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          {/* View Full Review */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View full review
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Full Review Details</DialogTitle>
                                <DialogDescription>
                                  Complete review information and customer
                                  details
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage
                                      src="/placeholder.svg"
                                      alt={review.customer?.name}
                                    />
                                    <AvatarFallback>
                                      {review.customer?.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("") || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-semibold">
                                      {review.customer?.name ||
                                        "Unknown Customer"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {review.customer?.email}
                                    </p>
                                  </div>
                                </div>

                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-2">Product</h4>
                                  <p className="font-semibold">
                                    {review.product?.name || "Unknown Product"}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    SKU: {review.product?.sku}
                                  </p>
                                </div>

                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-2">
                                    Rating & Review
                                  </h4>
                                  {renderStars(review.rating)}
                                  {review.title && (
                                    <h5 className="font-medium mt-3 mb-2">
                                      {review.title}
                                    </h5>
                                  )}
                                  <p className="text-sm">
                                    {review.comment || "No comment provided"}
                                  </p>
                                </div>

                                <div className="border-t pt-4 flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant={
                                        review.verified
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {review.verified
                                        ? "Verified"
                                        : "Unverified"}
                                    </Badge>
                                    {review.verified && (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleString(
                                      "en-IN"
                                    )}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Verify/Unverify */}
                          <DropdownMenuItem
                            onClick={() =>
                              handleVerifyToggle(review.id, review.verified)
                            }
                            disabled={actionLoading === review.id}
                          >
                            {review.verified ? (
                              <>
                                <ShieldX className="mr-2 h-4 w-4" /> Mark as
                                unverified
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="mr-2 h-4 w-4" /> Mark as
                                verified
                              </>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {/* Reply to Review */}
                          {/* <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault()
                              setSelectedReview(review)
                            }}>
                              <Send className="mr-2 h-4 w-4" />
                              Reply to review
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reply to Review</DialogTitle>
                              <DialogDescription>
                                Send a response to {review.customer?.name || "this customer"}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="bg-muted p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                  {renderStars(review.rating)}
                                </div>
                                {review.title && <h5 className="font-medium mb-1">{review.title}</h5>}
                                <p className="text-sm">{review.comment || "No comment"}</p>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium mb-2 block">Your Reply</label>
                                <Textarea
                                  placeholder="Write your response to the customer..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  rows={4}
                                />
                              </div>
                            </div>

                            <DialogFooter>
                              <Button variant="outline" onClick={() => {
                                setSelectedReview(null)
                                setReplyText("")
                              }}>
                                Cancel
                              </Button>
                              <Button onClick={handleReplySubmit} disabled={!replyText.trim()}>
                                <Send className="mr-2 h-4 w-4" />
                                Send Reply
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog> */}

                          {/* Delete Review */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete review
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the review from{" "}
                                  {review.customer?.name || "this customer"} for{" "}
                                  {review.product?.name || "this product"}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={actionLoading === review.id}
                                >
                                  {actionLoading === review.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                      Deleting...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                                      Review
                                    </>
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {reviews.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No reviews found</p>
              </div>
            )}
          </div>

          {/* Card View - visible only on small screens */}
          <div className="md:hidden space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No reviews found</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 shadow-sm bg-white space-y-4"
                >
                  {/* Customer */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={review.customer?.name}
                      />
                      <AvatarFallback>
                        {review.customer?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {review.customer?.name || "Unknown"}
                      </div>
                    </div>
                  </div>

                  {/* Product */}
                  <div>
                    <div className="font-medium">
                      {review.product?.name || "Unknown Product"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {review.product?.sku}
                    </div>
                  </div>

                  {/* Rating & Review */}
                  <div>
                    {renderStars(review.rating)}
                    {review.title && (
                      <div className="font-medium mt-1">{review.title}</div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {review.comment || "No comment"}
                    </p>
                  </div>

                  {/* Status and Date */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={review.verified ? "default" : "secondary"}
                      >
                        {review.verified ? "Verified" : "Unverified"}
                      </Badge>
                      {review.verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          disabled={actionLoading === review.id}
                        >
                          {actionLoading === review.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        {/* View Full Review */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View full review
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Full Review Details</DialogTitle>
                              <DialogDescription>
                                Complete review information and customer details
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage
                                    src="/placeholder.svg"
                                    alt={review.customer?.name}
                                  />
                                  <AvatarFallback>
                                    {review.customer?.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("") || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold">
                                    {review.customer?.name ||
                                      "Unknown Customer"}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {review.customer?.email}
                                  </p>
                                </div>
                              </div>

                              <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">Product</h4>
                                <p className="font-semibold">
                                  {review.product?.name || "Unknown Product"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  SKU: {review.product?.sku}
                                </p>
                              </div>

                              <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">
                                  Rating & Review
                                </h4>
                                {renderStars(review.rating)}
                                {review.title && (
                                  <h5 className="font-medium mt-3 mb-2">
                                    {review.title}
                                  </h5>
                                )}
                                <p className="text-sm">
                                  {review.comment || "No comment provided"}
                                </p>
                              </div>

                              <div className="border-t pt-4 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant={
                                      review.verified ? "default" : "secondary"
                                    }
                                  >
                                    {review.verified
                                      ? "Verified"
                                      : "Unverified"}
                                  </Badge>
                                  {review.verified && (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleString(
                                    "en-IN"
                                  )}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Verify/Unverify */}
                        <DropdownMenuItem
                          onClick={() =>
                            handleVerifyToggle(review.id, review.verified)
                          }
                          disabled={actionLoading === review.id}
                        >
                          {review.verified ? (
                            <>
                              <ShieldX className="mr-2 h-4 w-4" /> Mark as
                              unverified
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="mr-2 h-4 w-4" /> Mark as
                              verified
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Reply to Review */}
                        {/* <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault()
                              setSelectedReview(review)
                            }}>
                              <Send className="mr-2 h-4 w-4" />
                              Reply to review
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reply to Review</DialogTitle>
                              <DialogDescription>
                                Send a response to {review.customer?.name || "this customer"}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="bg-muted p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                  {renderStars(review.rating)}
                                </div>
                                {review.title && <h5 className="font-medium mb-1">{review.title}</h5>}
                                <p className="text-sm">{review.comment || "No comment"}</p>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium mb-2 block">Your Reply</label>
                                <Textarea
                                  placeholder="Write your response to the customer..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  rows={4}
                                />
                              </div>
                            </div>

                            <DialogFooter>
                              <Button variant="outline" onClick={() => {
                                setSelectedReview(null)
                                setReplyText("")
                              }}>
                                Cancel
                              </Button>
                              <Button onClick={handleReplySubmit} disabled={!replyText.trim()}>
                                <Send className="mr-2 h-4 w-4" />
                                Send Reply
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog> */}

                        {/* Delete Review */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete review
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the review from{" "}
                                {review.customer?.name || "this customer"} for{" "}
                                {review.product?.name || "this product"}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteReview(review.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={actionLoading === review.id}
                              >
                                {actionLoading === review.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                    Deleting...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    Review
                                  </>
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
          {reviews.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviews found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

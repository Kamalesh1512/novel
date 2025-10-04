// "use client";

// import { useState, useEffect } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   FormDescription,
// } from "@/components/ui/form";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { toast } from "sonner";
// import { useImageStore } from "@/store/imageStore";
// import ImageUpload from "../global/upload-image";
// import { useProductStore } from "@/store/productStore";
// import { useRouter } from "next/navigation";
// import { Category } from "@/lib/constants/types";
// import {
//   X,
//   Plus,
//   Package,
//   Trash2,
//   HelpCircle,
//   ShoppingCart,
//   Star,
//   MessageCircle,
// } from "lucide-react";
// import {
//   ProductFormData,
//   productSchema,
//   SellerFormData,
//   FaqFormData,
//   CustomerReviewFormData,
// } from "@/lib/schema/productSchema";

// interface ProductFormProps {
//   product?: any;
//   onSuccess: () => void;
// }

// const VARIANT_OPTIONS = [
//   "Pack of 1",
//   "Pack of 2",
//   "Pack of 3",
//   "Pack of 4",
//   "Pack of 5",
//   "Pack of 6",
//   "Pack of 8",
//   "Pack of 10",
//   "Pack of 12",
//   "Single Unit",
//   "Bulk Pack",
//   "Small",
//   "Medium",
//   "Large",
//   "XL",
// ];

// const OFFER_OPTIONS = ["Steal Deals", "None"];

// // Seller options
// const SELLER_OPTIONS = ["Amazon", "Meesho", "Flipkart"];

// export function ProductForm({ product, onSuccess }: ProductFormProps) {
//   const { clearImages } = useImageStore();
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [images, setImages] = useState<string[]>(
//     product?.images
//       ? typeof product.images === "string"
//         ? JSON.parse(product.images)
//         : product.images
//       : []
//   );
//   const [features, setFeatures] = useState<string[]>(
//     product?.features
//       ? typeof product.features === "string"
//         ? JSON.parse(product.features)
//         : product.features
//       : []
//   );
//   const [newFeature, setNewFeature] = useState("");

//   const router = useRouter();

//   // Parse existing sellers from product data
//   const parseSellers = (sellersData: any): SellerFormData[] => {
//     if (!sellersData) return [];

//     try {
//       if (typeof sellersData === "string") {
//         return JSON.parse(sellersData);
//       }
//       return Array.isArray(sellersData) ? sellersData : [];
//     } catch (error) {
//       console.error("Error parsing sellers:", error);
//       return [];
//     }
//   };

//   // Parse existing FAQs from product data
//   const parseFaqs = (faqsData: any): FaqFormData[] => {
//     if (!faqsData) return [];

//     try {
//       if (typeof faqsData === "string") {
//         return JSON.parse(faqsData);
//       }
//       return Array.isArray(faqsData) ? faqsData : [];
//     } catch (error) {
//       console.error("Error parsing FAQs:", error);
//       return [];
//     }
//   };

//   // Parse existing customer reviews from product data
//   const parseCustomerReviews = (reviewsData: any): CustomerReviewFormData[] => {
//     if (!reviewsData) return [];

//     try {
//       if (typeof reviewsData === "string") {
//         return JSON.parse(reviewsData);
//       }
//       return Array.isArray(reviewsData) ? reviewsData : [];
//     } catch (error) {
//       console.error("Error parsing customer reviews:", error);
//       return [];
//     }
//   };

//   const form = useForm<ProductFormData>({
//     resolver: zodResolver(productSchema),
//     defaultValues: {
//       name: product?.name || "",
//       description: product?.description || "",
//       shortDescription: product?.shortDescription || "",
//       price: product?.price || 0,
//       salePrice: product?.salePrice || 0,
//       sellers: parseSellers(product?.sellers) || [],
//       size: product?.size || "",
//       sku: product?.sku || "",
//       stock: product?.stock || 0,
//       categoryId: product?.categoryId || "",
//       images: product?.images || "",
//       modelUrl: product?.modelUrl || "",
//       featured: product?.featured || false,
//       bestSeller: product?.bestSeller || false,
//       published: product?.published ?? true,
//       seoTitle: product?.seoTitle || "",
//       seoDescription: product?.seoDescription || "",
//       weight: product?.weight || undefined,
//       features: Array.isArray(product?.features) ? product.features : [],
//       faqs: parseFaqs(product?.faqs) || [],
//       customerReviews: parseCustomerReviews(product?.customerReviews) || [],

//       // Legacy seller fields (kept for backward compatibility)
//       amazonEnabled: false,
//       amazonUrl: "",
//       meeshoEnabled: false,
//       meeshoUrl: "",
//       flipkartEnabled: false,
//       flipkartUrl: "",
//     },
//   });

//   // Field arrays for dynamic sections
//   const {
//     fields: sellerFields,
//     append: appendSeller,
//     remove: removeSeller,
//   } = useFieldArray({
//     control: form.control,
//     name: "sellers",
//   });

//   const {
//     fields: faqFields,
//     append: appendFaq,
//     remove: removeFaq,
//   } = useFieldArray({
//     control: form.control,
//     name: "faqs",
//   });

//   const {
//     fields: reviewFields,
//     append: appendReview,
//     remove: removeReview,
//   } = useFieldArray({
//     control: form.control,
//     name: "customerReviews",
//   });

//   const productId = product?.id || "new-product";

//   // Handle features
//   const addFeature = () => {
//     if (newFeature.trim() && !features.includes(newFeature.trim())) {
//       const updatedFeatures = [...features, newFeature.trim()];
//       setFeatures(updatedFeatures);
//       form.setValue("features", updatedFeatures);
//       setNewFeature("");
//     }
//   };

//   const removeFeature = (index: number) => {
//     const updatedFeatures = features.filter((_, i) => i !== index);
//     setFeatures(updatedFeatures);
//     form.setValue("features", updatedFeatures);
//   };

//   // Add new seller
//   const addSeller = () => {
//     appendSeller({
//       name: "",
//       variant: "",
//       url: "",
//       offer: "",
//     });
//   };

//   // Add new FAQ
//   const addFaq = () => {
//     appendFaq({
//       question: "",
//       answer: "",
//     });
//   };

//   // Add new customer review
//   const addCustomerReview = () => {
//     appendReview({
//       sellerName: "",
//       totalReviews: 0,
//       averageRating: 0,
//       topComments: [],
//     });
//   };

//   // Add comment to specific review
//   const addCommentToReview = (reviewIndex: number) => {
//     const currentReview = form.getValues(`customerReviews.${reviewIndex}`);
//     const updatedComments = [
//       ...(currentReview.topComments || []),
//       {
//         comment: "",
//         rating: 5,
//         reviewerName: "",
//         date: "",
//       },
//     ];
//     form.setValue(
//       `customerReviews.${reviewIndex}.topComments`,
//       updatedComments
//     );
//   };

//   // Remove comment from specific review
//   const removeCommentFromReview = (
//     reviewIndex: number,
//     commentIndex: number
//   ) => {
//     const currentReview = form.getValues(`customerReviews.${reviewIndex}`);
//     const updatedComments =
//       currentReview.topComments?.filter((_, i) => i !== commentIndex) || [];
//     form.setValue(
//       `customerReviews.${reviewIndex}.topComments`,
//       updatedComments
//     );
//   };

//   useEffect(() => {
//     if (!product || !product.images) return;

//     let parsedImages: string[] = [];

//     if (Array.isArray(product.images)) {
//       parsedImages = product.images.flatMap((img: any) => {
//         try {
//           const maybeParsed = JSON.parse(img);
//           return Array.isArray(maybeParsed) ? maybeParsed : [img];
//         } catch {
//           return [img];
//         }
//       });
//     } else if (typeof product.images === "string") {
//       try {
//         const maybeParsed = JSON.parse(product.images);
//         parsedImages = Array.isArray(maybeParsed)
//           ? maybeParsed
//           : [product.images];
//       } catch {
//         parsedImages = [product.images];
//       }
//     }

//     clearImages(productId);
//     parsedImages.forEach((imgUrl: string) =>
//       useImageStore.getState().addImage(productId, imgUrl)
//     );
//   }, [product, clearImages, productId]);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch("/api/categories");
//       if (!response.ok) {
//         throw new Error("Failed to fetch categories");
//       }
//       const data = await response.json();
//       setCategories(data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       toast.error("Failed to load categories");
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const onSubmit = async (data: ProductFormData) => {
//     setLoading(true);
//     try {
//       const url = product
//         ? `/api/admin/products/${product.id}`
//         : "/api/admin/products";
//       const method = product ? "PUT" : "POST";

//       // Filter out sellers with empty required fields
//       const validSellers =
//         data.sellers?.filter((seller) => seller.name && seller.url) || [];

//       // Filter out customer reviews with empty required fields
//       const validCustomerReviews =
//         data.customerReviews?.filter((review) => review.sellerName) || [];

//       const payload = {
//         name: data.name,
//         description: data.description,
//         shortDescription: data.shortDescription,
//         price:data.price,
//         salePrice:data.salePrice,
//         sellers: validSellers,
//         size: data.size,
//         sku: data.sku,
//         stock: data.stock,
//         categoryId: data.categoryId,
//         modelUrl: data.modelUrl,
//         featured: data.featured,
//         bestSeller: data.bestSeller,
//         published: data.published,
//         seoTitle: data.seoTitle,
//         seoDescription: data.seoDescription,
//         weight: data.weight,
//         images,
//         features,
//         faqs: data.faqs?.filter((faq) => faq.question && faq.answer) || [],
//         customerReviews: validCustomerReviews,
//       };

//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const responseData = await response.json();

//       if (response.ok) {
//         toast.success("Success", {
//           description: product
//             ? "Product updated successfully"
//             : "Product created successfully",
//         });
//         onSuccess();
//         router.refresh();
//       } else {
//         toast.error("Error", {
//           description: responseData.message || "Failed to save product",
//         });
//       }
//     } catch (error) {
//       console.error("Error saving product:", error);
//       toast.error("Error", {
//         description: "An unexpected error occurred while saving the product",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         {/* Product Images */}
//         <div className="space-y-2">
//           <FormLabel>Product Images</FormLabel>
//           <ImageUpload images={images} setImages={setImages} />
//         </div>

//         {/* Basic Product Information */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Product Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter product name" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="sku"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>SKU</FormLabel>
//                 <FormControl>
//                   <Input placeholder="PROD-001" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="price"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Price</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     step="0.1"
//                     placeholder="0.00"
//                     value={field.value ?? ""}
//                     onChange={(e) =>
//                       field.onChange(
//                         e.target.value === ""
//                           ? null
//                           : parseFloat(e.target.value)
//                       )
//                     }
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="salePrice"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Sale Price (Optional)</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     step="0.1"
//                     placeholder="0.00"
//                     value={field.value ?? ""}
//                     onChange={(e) =>
//                       field.onChange(
//                         e.target.value === ""
//                           ? null
//                           : parseFloat(e.target.value)
//                       )
//                     }
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="stock"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Stock Quantity</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     placeholder="0"
//                     {...field}
//                     onChange={(e) =>
//                       field.onChange(parseInt(e.target.value) || 0)
//                     }
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="categoryId"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Category</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a category" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {categories.map((category: any) => (
//                       <SelectItem key={category.id} value={category.id}>
//                         {category.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="size"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Size (Optional)</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="Enter size (e.g., Large, 32GB)"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* <FormField
//             control={form.control}
//             name="weight"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Weight (kg)</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     step="0.1"
//                     placeholder="0.0"
//                     value={field.value ?? ""}
//                     onChange={(e) =>
//                       field.onChange(
//                         e.target.value === ""
//                           ? undefined
//                           : parseFloat(e.target.value)
//                       )
//                     }
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           /> */}
//         </div>

//         {/* Descriptions */}
//         <FormField
//           control={form.control}
//           name="shortDescription"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Short Description</FormLabel>
//               <FormControl>
//                 <Textarea
//                   placeholder="Brief product description"
//                   className="min-h-[80px]"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Full Description</FormLabel>
//               <FormControl>
//                 <Textarea
//                   placeholder="Detailed product description"
//                   className="min-h-[120px]"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Features Section */}
//         <div className="space-y-4">
//           <FormLabel>Product Features</FormLabel>
//           <div className="flex gap-2">
//             <Input
//               placeholder="Add a feature..."
//               value={newFeature}
//               onChange={(e) => setNewFeature(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   addFeature();
//                 }
//               }}
//             />
//             <Button
//               type="button"
//               variant="outline"
//               size="icon"
//               onClick={addFeature}
//               disabled={!newFeature.trim()}
//             >
//               <Plus className="h-4 w-4" />
//             </Button>
//           </div>

//           {features.length > 0 && (
//             <div className="space-y-2">
//               {features.map((feature, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
//                 >
//                   <span className="text-sm">{feature}</span>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => removeFeature(index)}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* 3D Model */}
//         <FormField
//           control={form.control}
//           name="modelUrl"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>3D Model Path</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter path of 3D model" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Seller Integrations with Variants */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle className="flex items-center gap-2">
//               <ShoppingCart className="h-5 w-5" />
//               Seller Integrations
//             </CardTitle>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={addSeller}
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Add Seller
//             </Button>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {sellerFields.map((field, index) => (
//                 <div key={field.id} className="border p-4 rounded-lg space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h4 className="font-medium">Seller #{index + 1}</h4>
//                     {sellerFields.length > 1 && (
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => removeSeller(index)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <FormField
//                       control={form.control}
//                       name={`sellers.${index}.name`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Seller Platform</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select seller" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {SELLER_OPTIONS.map((seller) => (
//                                 <SelectItem key={seller} value={seller}>
//                                   {seller}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name={`sellers.${index}.variant`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Variant</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select variant" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {VARIANT_OPTIONS.map((variant) => (
//                                 <SelectItem key={variant} value={variant}>
//                                   {variant}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name={`sellers.${index}.offer`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Offer</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select offer" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {OFFER_OPTIONS.map((offer) => (
//                                 <SelectItem key={offer} value={offer}>
//                                   {offer}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name={`sellers.${index}.url`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Product URL</FormLabel>
//                           <FormControl>
//                             <Input placeholder="https://..." {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Customer Reviews Section */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle className="flex items-center gap-2">
//               <Star className="h-5 w-5" />
//               Customer Reviews
//             </CardTitle>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={addCustomerReview}
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Add Review Data
//             </Button>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-6">
//               {reviewFields.map((field, reviewIndex) => (
//                 <div key={field.id} className="border p-4 rounded-lg space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h4 className="font-medium">
//                       Review Data #{reviewIndex + 1}
//                     </h4>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => removeReview(reviewIndex)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   {/* Basic Review Info */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <FormField
//                       control={form.control}
//                       name={`customerReviews.${reviewIndex}.sellerName`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Seller Platform</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select seller" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {SELLER_OPTIONS.map((seller) => (
//                                 <SelectItem key={seller} value={seller}>
//                                   {seller}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name={`customerReviews.${reviewIndex}.totalReviews`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Total Reviews</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="number"
//                               placeholder="0"
//                               {...field}
//                               onChange={(e) =>
//                                 field.onChange(parseInt(e.target.value) || 0)
//                               }
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name={`customerReviews.${reviewIndex}.averageRating`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Average Rating</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="number"
//                               step="0.1"
//                               min="0"
//                               max="5"
//                               placeholder="0.0"
//                               {...field}
//                               onChange={(e) =>
//                                 field.onChange(parseFloat(e.target.value) || 0)
//                               }
//                             />
//                           </FormControl>
//                           <FormDescription>
//                             Rating between 0 and 5
//                           </FormDescription>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   {/* Top Comments */}
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <FormLabel className="flex items-center gap-2">
//                         <MessageCircle className="h-4 w-4" />
//                         Top Comments
//                       </FormLabel>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={() => addCommentToReview(reviewIndex)}
//                       >
//                         <Plus className="h-4 w-4 mr-2" />
//                         Add Comment
//                       </Button>
//                     </div>

//                     <div className="space-y-3">
//                       {form
//                         .watch(`customerReviews.${reviewIndex}.topComments`)
//                         ?.map((_, commentIndex) => (
//                           <div
//                             key={commentIndex}
//                             className="border border-gray-200 p-3 rounded-md space-y-3"
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="text-sm font-medium">
//                                 Comment #{commentIndex + 1}
//                               </span>
//                               <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() =>
//                                   removeCommentFromReview(
//                                     reviewIndex,
//                                     commentIndex
//                                   )
//                                 }
//                               >
//                                 <X className="h-4 w-4" />
//                               </Button>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                               <FormField
//                                 control={form.control}
//                                 name={`customerReviews.${reviewIndex}.topComments.${commentIndex}.reviewerName`}
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel className="text-xs">
//                                       Reviewer Name
//                                     </FormLabel>
//                                     <FormControl>
//                                       <Input
//                                         placeholder="Enter reviewer name"
//                                         {...field}
//                                       />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />

//                               <FormField
//                                 control={form.control}
//                                 name={`customerReviews.${reviewIndex}.topComments.${commentIndex}.rating`}
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel className="text-xs">
//                                       Rating
//                                     </FormLabel>
//                                     <Select
//                                       onValueChange={(value) =>
//                                         field.onChange(parseInt(value))
//                                       }
//                                       value={field.value?.toString()}
//                                     >
//                                       <FormControl>
//                                         <SelectTrigger>
//                                           <SelectValue placeholder="Select rating" />
//                                         </SelectTrigger>
//                                       </FormControl>
//                                       <SelectContent>
//                                         {[1, 2, 3, 4, 5].map((rating) => (
//                                           <SelectItem
//                                             key={rating}
//                                             value={rating.toString()}
//                                           >
//                                             <div className="flex items-center gap-1">
//                                               {rating}
//                                               <Star className="h-3 w-3 fill-current" />
//                                             </div>
//                                           </SelectItem>
//                                         ))}
//                                       </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />

//                               <FormField
//                                 control={form.control}
//                                 name={`customerReviews.${reviewIndex}.topComments.${commentIndex}.date`}
//                                 render={({ field }) => (
//                                   <FormItem>
//                                     <FormLabel className="text-xs">
//                                       Review Date
//                                     </FormLabel>
//                                     <FormControl>
//                                       <Input type="date" {...field} />
//                                     </FormControl>
//                                     <FormMessage />
//                                   </FormItem>
//                                 )}
//                               />
//                             </div>

//                             <FormField
//                               control={form.control}
//                               name={`customerReviews.${reviewIndex}.topComments.${commentIndex}.comment`}
//                               render={({ field }) => (
//                                 <FormItem>
//                                   <FormLabel className="text-xs">
//                                     Comment
//                                   </FormLabel>
//                                   <FormControl>
//                                     <Textarea
//                                       placeholder="Enter customer review comment"
//                                       className="min-h-[60px]"
//                                       {...field}
//                                     />
//                                   </FormControl>
//                                   <FormMessage />
//                                 </FormItem>
//                               )}
//                             />
//                           </div>
//                         )) || []}

//                       {(!form.watch(
//                         `customerReviews.${reviewIndex}.topComments`
//                       ) ||
//                         form.watch(`customerReviews.${reviewIndex}.topComments`)
//                           ?.length === 0) && (
//                         <div className="text-center text-gray-500 py-4">
//                           <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
//                           <p className="text-sm">
//                             No comments added yet. Click "Add Comment" to get
//                             started.
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {reviewFields.length === 0 && (
//                 <div className="text-center text-gray-500 py-8">
//                   <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//                   <p>
//                     No customer review data added yet. Click "Add Review Data"
//                     to get started.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* FAQ Section */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle className="flex items-center gap-2">
//               <HelpCircle className="h-5 w-5" />
//               Frequently Asked Questions
//             </CardTitle>
//             <Button type="button" variant="outline" size="sm" onClick={addFaq}>
//               <Plus className="h-4 w-4 mr-2" />
//               Add FAQ
//             </Button>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {faqFields.map((field, index) => (
//                 <div key={field.id} className="border p-4 rounded-lg space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h4 className="font-medium">FAQ #{index + 1}</h4>
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => removeFaq(index)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   <div className="space-y-4">
//                     <FormField
//                       control={form.control}
//                       name={`faqs.${index}.question`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Question</FormLabel>
//                           <FormControl>
//                             <Input
//                               placeholder="Enter frequently asked question"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name={`faqs.${index}.answer`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Answer</FormLabel>
//                           <FormControl>
//                             <Textarea
//                               placeholder="Enter the answer to this question"
//                               className="min-h-[80px]"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>
//               ))}

//               {faqFields.length === 0 && (
//                 <div className="text-center text-gray-500 py-8">
//                   <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//                   <p>No FAQs added yet. Click "Add FAQ" to get started.</p>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* SEO Section */}
//         <Card>
//           <CardHeader>
//             <CardTitle>SEO Settings</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               control={form.control}
//               name="seoTitle"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>SEO Title</FormLabel>
//                   <FormControl>
//                     <Input placeholder="SEO optimized title" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="seoDescription"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>SEO Description</FormLabel>
//                   <FormControl>
//                     <Textarea placeholder="SEO meta description" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </CardContent>
//         </Card>

//         {/* Product Settings */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Product Settings</CardTitle>
//           </CardHeader>
//           <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             <FormField
//               control={form.control}
//               name="featured"
//               render={({ field }) => (
//                 <FormItem className="flex items-center justify-between gap-4 p-4 border rounded-lg">
//                   <div>
//                     <FormLabel className="text-base">Steal Deals</FormLabel>
//                   </div>
//                   <FormControl>
//                     <Switch
//                       checked={field.value}
//                       onCheckedChange={field.onChange}
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="bestSeller"
//               render={({ field }) => (
//                 <FormItem className="flex items-center justify-between gap-4 p-4 border rounded-lg">
//                   <div>
//                     <FormLabel className="text-base">Best Seller</FormLabel>
//                   </div>
//                   <FormControl>
//                     <Switch
//                       checked={field.value}
//                       onCheckedChange={field.onChange}
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="published"
//               render={({ field }) => (
//                 <FormItem className="flex items-center justify-between gap-4 p-4 border rounded-lg">
//                   <div>
//                     <FormLabel className="text-base">Published</FormLabel>
//                   </div>
//                   <FormControl>
//                     <Switch
//                       checked={field.value}
//                       onCheckedChange={field.onChange}
//                     />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//           </CardContent>
//         </Card>

//         {/* Form Actions */}
//         <div className="flex justify-end space-x-4 pt-6 border-t">
//           <Button type="button" variant="outline" onClick={onSuccess}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={loading}>
//             {loading
//               ? "Saving..."
//               : product
//               ? "Update Product"
//               : "Create Product"}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { useImageStore } from "@/store/imageStore";
import ImageUpload from "../global/upload-image";
import { useProductStore } from "@/store/productStore";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/constants/types";
import {
  X,
  Plus,
  Package,
  Trash2,
  HelpCircle,
  ShoppingCart,
  Star,
  MessageCircle,
  ClipboardList,
  Pill,
  Image,
} from "lucide-react";
import {
  ProductFormData,
  productSchema,
  SellerFormData,
  FaqFormData,
  CustomerReviewFormData,
  HowToUseFormData,
  IngredientFormData,
} from "@/lib/schema/productSchema";

interface ProductFormProps {
  product?: any;
  onSuccess: () => void;
}

const VARIANT_OPTIONS = [
  "Pack of 1",
  "Pack of 2",
  "Pack of 3",
  "Pack of 4",
  "Pack of 5",
  "Pack of 6",
  "Pack of 8",
  "Pack of 10",
  "Pack of 12",
  "Single Unit",
  "Bulk Pack",
  "Small",
  "Medium",
  "Large",
  "XL",
];

const OFFER_OPTIONS = ["Steal Deals", "None"];

// Seller options
const SELLER_OPTIONS = ["Amazon", "Meesho", "Flipkart"];

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { clearImages } = useImageStore();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>(
    product?.images
      ? typeof product.images === "string"
        ? JSON.parse(product.images)
        : product.images
      : []
  );
  const [features, setFeatures] = useState<string[]>(
    product?.features
      ? typeof product.features === "string"
        ? JSON.parse(product.features)
        : product.features
      : []
  );
  const [newFeature, setNewFeature] = useState("");

  const router = useRouter();

  // Parse existing sellers from product data
  const parseSellers = (sellersData: any): SellerFormData[] => {
    if (!sellersData) return [];

    try {
      if (typeof sellersData === "string") {
        return JSON.parse(sellersData);
      }
      return Array.isArray(sellersData) ? sellersData : [];
    } catch (error) {
      console.error("Error parsing sellers:", error);
      return [];
    }
  };

  // Parse existing FAQs from product data
  const parseFaqs = (faqsData: any): FaqFormData[] => {
    if (!faqsData) return [];

    try {
      if (typeof faqsData === "string") {
        return JSON.parse(faqsData);
      }
      return Array.isArray(faqsData) ? faqsData : [];
    } catch (error) {
      console.error("Error parsing FAQs:", error);
      return [];
    }
  };

  // Parse existing customer reviews from product data
  const parseCustomerReviews = (reviewsData: any): CustomerReviewFormData[] => {
    if (!reviewsData) return [];

    try {
      if (typeof reviewsData === "string") {
        return JSON.parse(reviewsData);
      }
      return Array.isArray(reviewsData) ? reviewsData : [];
    } catch (error) {
      console.error("Error parsing customer reviews:", error);
      return [];
    }
  };

  // Parse existing how to use from product data
  const parseHowToUse = (howToUseData: any): HowToUseFormData[] => {
    if (!howToUseData) return [];

    try {
      if (typeof howToUseData === "string") {
        return JSON.parse(howToUseData);
      }
      return Array.isArray(howToUseData) ? howToUseData : [];
    } catch (error) {
      console.error("Error parsing how to use:", error);
      return [];
    }
  };

  // Parse existing ingredients from product data
  const parseIngredients = (ingredientsData: any): IngredientFormData[] => {
    if (!ingredientsData) return [];

    try {
      if (typeof ingredientsData === "string") {
        return JSON.parse(ingredientsData);
      }
      return Array.isArray(ingredientsData) ? ingredientsData : [];
    } catch (error) {
      console.error("Error parsing ingredients:", error);
      return [];
    }
  };

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      shortDescription: product?.shortDescription || "",
      price: product?.price || 0,
      salePrice: product?.salePrice || 0,
      sellers: parseSellers(product?.sellers) || [],
      size: product?.size || "",
      sku: product?.sku || "",
      stock: product?.stock || 0,
      categoryId: product?.categoryId || "",
      images: product?.images || "",
      modelUrl: product?.modelUrl || "",
      featured: product?.featured || false,
      bestSeller: product?.bestSeller || false,
      published: product?.published ?? true,
      seoTitle: product?.seoTitle || "",
      seoDescription: product?.seoDescription || "",
      weight: product?.weight || undefined,
      features: Array.isArray(product?.features) ? product.features : [],
      faqs: parseFaqs(product?.faqs) || [],
      customerReviews: parseCustomerReviews(product?.customerReviews) || [],
      howToUse: parseHowToUse(product?.howToUse) || [],
      ingredients: parseIngredients(product?.ingredients) || [],

      // Legacy seller fields (kept for backward compatibility)
      amazonEnabled: false,
      amazonUrl: "",
      meeshoEnabled: false,
      meeshoUrl: "",
      flipkartEnabled: false,
      flipkartUrl: "",
    },
  });

  // Field arrays for dynamic sections
  const {
    fields: sellerFields,
    append: appendSeller,
    remove: removeSeller,
  } = useFieldArray({
    control: form.control,
    name: "sellers",
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  const {
    fields: reviewFields,
    append: appendReview,
    remove: removeReview,
  } = useFieldArray({
    control: form.control,
    name: "customerReviews",
  });

  const {
    fields: howToUseFields,
    append: appendHowToUse,
    remove: removeHowToUse,
  } = useFieldArray({
    control: form.control,
    name: "howToUse",
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const productId = product?.id || "new-product";

  // Handle features
  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      const updatedFeatures = [...features, newFeature.trim()];
      setFeatures(updatedFeatures);
      form.setValue("features", updatedFeatures);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
    form.setValue("features", updatedFeatures);
  };

  // Add new seller
  const addSeller = () => {
    appendSeller({
      name: "",
      variant: "",
      url: "",
      offer: "",
    });
  };

  // Add new FAQ
  const addFaq = () => {
    appendFaq({
      question: "",
      answer: "",
    });
  };

  // Add new customer review
  const addCustomerReview = () => {
    appendReview({
      sellerName: "",
      totalReviews: 0,
      averageRating: 0,
      topComments: [],
    });
  };

  // Add new how to use step
  const addHowToUse = () => {
    appendHowToUse({
      steps: "",
      answer: "",
    });
  };

  // Add new ingredient
  const addIngredient = () => {
    appendIngredient({
      name: "",
      image: "",
      description: "",
    });
  };

  // Add comment to specific review
  const addCommentToReview = (reviewIndex: number) => {
    const currentReview = form.getValues(`customerReviews.${reviewIndex}`);
    const updatedComments = [
      ...(currentReview.topComments || []),
      {
        comment: "",
        rating: 5,
        reviewerName: "",
        date: "",
      },
    ];
    form.setValue(
      `customerReviews.${reviewIndex}.topComments`,
      updatedComments
    );
  };

  // Remove comment from specific review
  const removeCommentFromReview = (
    reviewIndex: number,
    commentIndex: number
  ) => {
    const currentReview = form.getValues(`customerReviews.${reviewIndex}`);
    const updatedComments =
      currentReview.topComments?.filter((_, i) => i !== commentIndex) || [];
    form.setValue(
      `customerReviews.${reviewIndex}.topComments`,
      updatedComments
    );
  };

  useEffect(() => {
    if (!product || !product.images) return;

    let parsedImages: string[] = [];

    if (Array.isArray(product.images)) {
      parsedImages = product.images.flatMap((img: any) => {
        try {
          const maybeParsed = JSON.parse(img);
          return Array.isArray(maybeParsed) ? maybeParsed : [img];
        } catch {
          return [img];
        }
      });
    } else if (typeof product.images === "string") {
      try {
        const maybeParsed = JSON.parse(product.images);
        parsedImages = Array.isArray(maybeParsed)
          ? maybeParsed
          : [product.images];
      } catch {
        parsedImages = [product.images];
      }
    }

    clearImages(productId);
    parsedImages.forEach((imgUrl: string) =>
      useImageStore.getState().addImage(productId, imgUrl)
    );
  }, [product, clearImages, productId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      // Filter out sellers with empty required fields
      const validSellers =
        data.sellers?.filter((seller) => seller.name && seller.url) || [];

      // Filter out customer reviews with empty required fields
      const validCustomerReviews =
        data.customerReviews?.filter((review) => review.sellerName) || [];

      // Filter out how to use with empty required fields
      const validHowToUse =
        data.howToUse?.filter((step) => step.steps && step.answer) || [];

      // Filter out ingredients with empty required fields
      const validIngredients =
        data.ingredients?.filter((ingredient) => ingredient.name && ingredient.description) || [];

      const payload = {
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        salePrice: data.salePrice,
        sellers: validSellers,
        size: data.size,
        sku: data.sku,
        stock: data.stock,
        categoryId: data.categoryId,
        modelUrl: data.modelUrl,
        featured: data.featured,
        bestSeller: data.bestSeller,
        published: data.published,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        weight: data.weight,
        images,
        features,
        faqs: data.faqs?.filter((faq) => faq.question && faq.answer) || [],
        customerReviews: validCustomerReviews,
        howToUse: validHowToUse,
        ingredients: validIngredients,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Success", {
          description: product
            ? "Product updated successfully"
            : "Product created successfully",
        });
        onSuccess();
        router.refresh();
      } else {
        toast.error("Error", {
          description: responseData.message || "Failed to save product",
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Error", {
        description: "An unexpected error occurred while saving the product",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Images */}
        <div className="space-y-2">
          <FormLabel>Product Images</FormLabel>
          <ImageUpload images={images} setImages={setImages} />
        </div>

        {/* Basic Product Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="PROD-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.00"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? null
                          : parseFloat(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale Price (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.00"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? null
                          : parseFloat(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter size (e.g., Large, 32GB)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Descriptions */}
        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief product description"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed product description"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Features Section */}
        <div className="space-y-4">
          <FormLabel>Product Features</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Add a feature..."
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addFeature}
              disabled={!newFeature.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {features.length > 0 && (
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                >
                  <span className="text-sm">{feature}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How To Use Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              How To Use
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addHowToUse}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {howToUseFields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Step #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHowToUse(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`howToUse.${index}.steps`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Steps (e.g., step1, step2, step3)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter step identifier (e.g., step1, step2)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`howToUse.${index}.answer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instructions</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter detailed instructions for this step"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              {howToUseFields.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <ClipboardList className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No how-to-use steps added yet. Click "Add Step" to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ingredients Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Ingredients
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIngredient}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ingredientFields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Ingredient #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ingredient Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter ingredient name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.image`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="flex items-center gap-2">
                              <Image className="h-4 w-4" />
                              Image URL (Optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter ingredient description and benefits"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              {ingredientFields.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Pill className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No ingredients added yet. Click "Add Ingredient" to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 3D Model */}
        <FormField
          control={form.control}
          name="modelUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>3D Model Path</FormLabel>
              <FormControl>
                <Input placeholder="Enter path of 3D model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Seller Integrations with Variants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Seller Integrations
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSeller}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Seller
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sellerFields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Seller #{index + 1}</h4>
                    {sellerFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSeller(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`sellers.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seller Platform</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select seller" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SELLER_OPTIONS.map((seller) => (
                                <SelectItem key={seller} value={seller}>
                                  {seller}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`sellers.${index}.variant`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Variant</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select variant" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {VARIANT_OPTIONS.map((variant) => (
                                <SelectItem key={variant} value={variant}>
                                  {variant}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`sellers.${index}.offer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Offer</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select offer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {OFFER_OPTIONS.map((offer) => (
                                <SelectItem key={offer} value={offer}>
                                  {offer}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`sellers.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Reviews Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Customer Reviews
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCustomerReview}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Review Data
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviewFields.map((field, reviewIndex) => (
                <div key={field.id} className="border p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      Review Data #{reviewIndex + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeReview(reviewIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Basic Review Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`customerReviews.${reviewIndex}.sellerName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seller Platform</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select seller" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SELLER_OPTIONS.map((seller) => (
                                <SelectItem key={seller} value={seller}>
                                  {seller}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`customerReviews.${reviewIndex}.totalReviews`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Reviews</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`customerReviews.${reviewIndex}.averageRating`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average Rating</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="5"
                              placeholder="0.0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Rating between 0 and 5
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Top Comments */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Top Comments
                      </FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addCommentToReview(reviewIndex)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Comment
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {form
                        .watch(`customerReviews.${reviewIndex}.topComments`)
                        ?.map((_, commentIndex) => (
                          <div
                            key={commentIndex}
                            className="border border-gray-200 p-3 rounded-md space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                Comment #{commentIndex + 1}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeCommentFromReview(
                                    reviewIndex,
                                    commentIndex
                                  )
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <FormField
                                control={form.control}
                                name={`customerReviews.${reviewIndex}.topComments.${commentIndex}.reviewerName`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs">
                                      Reviewer Name
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter reviewer name"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`customerReviews.${reviewIndex}.topComments.${commentIndex}.rating`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs">
                                      Rating
                                    </FormLabel>
                                    <Select
                                      onValueChange={(value) =>
                                        field.onChange(parseInt(value))
                                      }
                                      value={field.value?.toString()}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select rating" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                          <SelectItem
                                            key={rating}
                                            value={rating.toString()}
                                          >
                                            <div className="flex items-center gap-1">
                                              {rating}
                                              <Star className="h-3 w-3 fill-current" />
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`customerReviews.${reviewIndex}.topComments.${commentIndex}.date`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs">
                                      Review Date
                                    </FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`customerReviews.${reviewIndex}.topComments.${commentIndex}.comment`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">
                                    Comment
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Enter customer review comment"
                                      className="min-h-[60px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )) || []}

                      {(!form.watch(
                        `customerReviews.${reviewIndex}.topComments`
                      ) ||
                        form.watch(`customerReviews.${reviewIndex}.topComments`)
                          ?.length === 0) && (
                        <div className="text-center text-gray-500 py-4">
                          <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">
                            No comments added yet. Click "Add Comment" to get
                            started.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {reviewFields.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>
                    No customer review data added yet. Click "Add Review Data"
                    to get started.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addFaq}>
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqFields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">FAQ #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFaq(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`faqs.${index}.question`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter frequently asked question"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`faqs.${index}.answer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Answer</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter the answer to this question"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              {faqFields.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No FAQs added yet. Click "Add FAQ" to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SEO Section */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <Input placeholder="SEO optimized title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seoDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="SEO meta description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Product Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Product Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-4 p-4 border rounded-lg">
                  <div>
                    <FormLabel className="text-base">Steal Deals</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bestSeller"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-4 p-4 border rounded-lg">
                  <div>
                    <FormLabel className="text-base">Best Seller</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-4 p-4 border rounded-lg">
                  <div>
                    <FormLabel className="text-base">Published</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : product
              ? "Update Product"
              : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

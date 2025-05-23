'use client';

import { useArticles } from "@/app/hooks/use-api-data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CalendarIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Article } from "@/app/api/services";

export function ArticlesList() {
  const { data: apiResponse, isLoading, error } = useArticles();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (apiResponse) {
      // Handle different possible API response structures
      let processedArticles: Article[] = [];
      
      if (Array.isArray(apiResponse)) {
        processedArticles = apiResponse;
      } else if (typeof apiResponse === 'object') {
        // Check if the API returns articles within a nested property
        const possibleArrays = Object.values(apiResponse).filter(Array.isArray);
        if (possibleArrays.length > 0) {
          processedArticles = possibleArrays[0];
        } else {
          console.error('Unexpected API response structure:', apiResponse);
        }
      }
      
      setArticles(processedArticles);
    }
  }, [apiResponse]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading articles...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading articles</div>;
  }

  if (articles.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Latest Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">No articles found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Latest Articles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {articles.slice(0, 10).map((article, index) => (
            <div key={article.id || index} className="border-b pb-4 last:border-b-0">
              <h3 className="font-medium text-lg">
                {article.urllink ? (
                  <Link href={article.urllink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 hover:underline flex items-start">
                    {article.title || "Untitled Article"}
                    <ExternalLinkIcon className="ml-1 h-4 w-4 inline-block" />
                  </Link>
                ) : (
                  <span>{article.title || "Untitled Article"}</span>
                )}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="flex items-center">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  {article.pubdate ? new Date(article.pubdate).toLocaleDateString() : "N/A"}
                </span>
                <span className="mx-2">•</span>
                <span>{article.feed || "Unknown Source"}</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{article.description || "No description available"}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
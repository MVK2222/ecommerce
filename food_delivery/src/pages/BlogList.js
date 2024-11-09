import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const blogPosts = [
  {
    title: "Delicious Pasta Recipes",
    content: "Discover the best pasta recipes that are easy to make and delicious to eat.",
    image: "/images/pasta.jpg" // Ensure the image is in the public/images directory
  },
  {
    title: "Healthy Salads for Summer",
    content: "Enjoy these refreshing and healthy salad recipes perfect for the summer season.",
    image: "/images/salad.jpg"
  },
  // Add more blog posts here
];

const BlogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const BlogPost = styled.div`
  width: 80%;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
`;

const BlogPostTitle = styled.h2`
  margin-bottom: 10px;
`;

const BlogPostImage = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 10px;
`;

const BlogPostContent = styled.p`
  font-size: 16px;
  line-height: 1.5;
`;

const Blog = () => {
  return (
    <BlogContainer>
      {blogPosts.map((post, index) => (
        <BlogPost key={index}>
          <BlogPostTitle>{post.title}</BlogPostTitle>
          <BlogPostImage src={post.image} alt={post.title} />
          <BlogPostContent>{post.content}</BlogPostContent>
        </BlogPost>
      ))}
    </BlogContainer>
  );
};

export default Blog;

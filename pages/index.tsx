import PostFeed from "@/components/posts/PostFeed"
import Header from "@/components/Header"
import Form from "@/components/Form"



export default function Home() {
  return (
    <>
    <Header label="Home"/>
    <Form placeholder="Whats's happening"/>
    <PostFeed/>
    </>
  )
}

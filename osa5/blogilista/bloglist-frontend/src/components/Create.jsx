const Create = ({addBlog, newTitle, newAuthor, newURL, handleTitle, handleAuthor, handleURL}) => {
   return( 
    <form onSubmit={addBlog}>
        <div>
          title: <input id="title" type="text" value={newTitle} onChange={handleTitle}/>
        </div>
        <div>
          author: <input id="author" type="text"value={newAuthor} onChange={handleAuthor}/>
        </div>
        <div>
          url: <input id="url" type="text" value={newURL} onChange={handleURL}/>
        </div>
        <div>
          <button id="submitBlog" type="submit">create</button>
       </div>
    </form>
)}

export default Create
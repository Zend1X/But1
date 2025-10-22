import React, { useState, useEffect } from 'react';
import { 
  getPosts, 
  createPost, 
  updatePost, 
  deletePost,
  resetPosts 
} from './services/api';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const postsData = await getPosts();
      setPosts(postsData);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при загрузке постов:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    setLoading(true);
    setError(null);
    try {
      const newPost = await createPost(postData);
      setPosts(prev => [newPost, ...prev]);
      setShowForm(false);
      alert('Пост успешно создан!');
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при создании поста:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async (postData) => {
    if (!editingPost) return;

    setLoading(true);
    setError(null);
    try {
      const updatedPost = await updatePost(editingPost.id, postData);
      setPosts(prev => prev.map(post => 
        post.id === editingPost.id ? updatedPost : post
      ));
      setEditingPost(null);
      alert('Пост успешно обновлен!');
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при обновлении поста:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    setError(null);
    try {
      await deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      alert('Пост успешно удален!');
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при удалении поста:', err);
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Вы уверены, что хотите сбросить все изменения?')) {
      setLoading(true);
      setError(null);
      try {
        const originalPosts = await resetPosts();
        setPosts(originalPosts);
        alert('Данные успешно сброшены к исходным!');
      } catch (err) {
        setError(err.message);
        console.error('Ошибка при сбросе данных:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setShowForm(false);
  };

  const handleFormSubmit = (formData) => {
    if (editingPost) {
      handleUpdatePost(formData);
    } else {
      handleCreatePost(formData);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>HTTP Methods Demo с локальными данными</h1>
        <p>Работа с JSON файлом через Fetch API</p>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-banner">
            <strong>Ошибка:</strong> {error}
            <button onClick={() => setError(null)} className="close-error">
              ×
            </button>
          </div>
        )}

        <div className="controls">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn-toggle-form"
          >
            {showForm ? 'Скрыть форму' : 'Создать новый пост'}
          </button>
          
          <button 
            onClick={fetchPosts}
            disabled={loading}
            className="btn-refresh"
          >
            Обновить посты
          </button>

          <button 
            onClick={handleResetData}
            disabled={loading}
            className="btn-reset"
          >
            Сбросить данные
          </button>
        </div>

        {(showForm || editingPost) && (
          <PostForm
            onSubmit={handleFormSubmit}
            initialData={editingPost}
            onCancel={handleCancelEdit}
          />
        )}

        {loading && <LoadingSpinner />}

        <PostList
          posts={posts}
          onEditPost={handleEditClick}
          onDeletePost={handleDeletePost}
          loading={loading && posts.length === 0}
        />
      </main>

      <footer className="App-footer">
        <p>Демонстрация HTTP-методов с локальным JSON файлом</p>
        <small>Данные сохраняются в localStorage браузера</small>
      </footer>
    </div>
  );
}

export default App; 
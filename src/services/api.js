const API_BASE_URL = '/Data/posts.json';

const readData = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Не удалось загрузить данные');
    }
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Ошибка чтения данных:', error);
    throw error;
  }
};

const writeData = async (posts) => {
  try {
    localStorage.setItem('posts', JSON.stringify(posts));
    return true;
  } catch (error) {
    console.error('Ошибка записи данных:', error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const localPosts = localStorage.getItem('posts');
    if (localPosts) {
      return JSON.parse(localPosts);
    }
    
    const posts = await readData();
    return posts;
  } catch (error) {
    throw new Error('Не удалось загрузить посты');
  }
};

export const getPost = async (id) => {
  try {
    const posts = await getPosts();
    const post = posts.find(post => post.id === parseInt(id));
    if (!post) {
      throw new Error(`Пост с ID ${id} не найден`);
    }
    return post;
  } catch (error) {
    throw new Error(`Не удалось загрузить пост ${id}`);
  }
};

export const createPost = async (postData) => {
  try {
    const posts = await getPosts();
    
    const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    
    const newPost = {
      id: newId,
      ...postData
    };
    
    const updatedPosts = [...posts, newPost];
    
    await writeData(updatedPosts);
    
    return newPost;
  } catch (error) {
    throw new Error('Не удалось создать пост');
  }
};

export const updatePost = async (id, postData) => {
  try {
    const posts = await getPosts();
    const postIndex = posts.findIndex(post => post.id === parseInt(id));
    
    if (postIndex === -1) {
      throw new Error(`Пост с ID ${id} не найден`);
    }
    
    const updatedPost = {
      id: parseInt(id),
      ...postData
    };
    
    const updatedPosts = [...posts];
    updatedPosts[postIndex] = updatedPost;
    
    await writeData(updatedPosts);
    
    return updatedPost;
  } catch (error) {
    throw new Error(`Не удалось обновить пост ${id}`);
  }
};

export const patchPost = async (id, postData) => {
  try {
    const posts = await getPosts();
    const postIndex = posts.findIndex(post => post.id === parseInt(id));
    
    if (postIndex === -1) {
      throw new Error(`Пост с ID ${id} не найден`);
    }
    
    const updatedPost = {
      ...posts[postIndex],
      ...postData,
      id: parseInt(id)
    };
    
    const updatedPosts = [...posts];
    updatedPosts[postIndex] = updatedPost;
    
    await writeData(updatedPosts);
    
    return updatedPost;
  } catch (error) {
    throw new Error(`Не удалось частично обновить пост ${id}`);
  }
};

export const deletePost = async (id) => {
  try {
    const posts = await getPosts();
    const postIndex = posts.findIndex(post => post.id === parseInt(id));
    
    if (postIndex === -1) {
      throw new Error(`Пост с ID ${id} не найден`);
    }
    
    const updatedPosts = posts.filter(post => post.id !== parseInt(id));
    
    await writeData(updatedPosts);
    
    return id;
  } catch (error) {
    throw new Error(`Не удалось удалить пост ${id}`);
  }
};

export const resetPosts = async () => {
  try {
    localStorage.removeItem('posts');
    const originalPosts = await readData();
    return originalPosts;
  } catch (error) {
    throw new Error('Не удалось сбросить данные');
  }
};
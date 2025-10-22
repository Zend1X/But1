// Базовый URL для доступа к данным
const API_BASE_URL = '/Data/posts.json';

// Вспомогательная функция для чтения данных из JSON файла
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

// Вспомогательная функция для записи данных в JSON файл
// В реальном приложении это бы делалось через бэкенд,
// но для демонстрации мы будем использовать localStorage как временное хранилище
const writeData = async (posts) => {
  try {
    // Сохраняем в localStorage для имитации сохранения на сервере
    localStorage.setItem('posts', JSON.stringify(posts));
    return true;
  } catch (error) {
    console.error('Ошибка записи данных:', error);
    throw error;
  }
};

// GET - получение всех постов
export const getPosts = async () => {
  try {
    // Пробуем получить данные из localStorage (обновленные)
    const localPosts = localStorage.getItem('posts');
    if (localPosts) {
      return JSON.parse(localPosts);
    }
    
    // Если в localStorage нет данных, загружаем из JSON файла
    const posts = await readData();
    return posts;
  } catch (error) {
    throw new Error('Не удалось загрузить посты');
  }
};

// GET - получение одного поста по ID
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

// POST - создание нового поста
export const createPost = async (postData) => {
  try {
    const posts = await getPosts();
    
    // Генерируем новый ID
    const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    
    const newPost = {
      id: newId,
      ...postData
    };
    
    // Добавляем новый пост
    const updatedPosts = [...posts, newPost];
    
    // Сохраняем обновленные данные
    await writeData(updatedPosts);
    
    return newPost;
  } catch (error) {
    throw new Error('Не удалось создать пост');
  }
};

// PUT - полное обновление поста
export const updatePost = async (id, postData) => {
  try {
    const posts = await getPosts();
    const postIndex = posts.findIndex(post => post.id === parseInt(id));
    
    if (postIndex === -1) {
      throw new Error(`Пост с ID ${id} не найден`);
    }
    
    // Создаем обновленный пост
    const updatedPost = {
      id: parseInt(id),
      ...postData
    };
    
    // Обновляем массив постов
    const updatedPosts = [...posts];
    updatedPosts[postIndex] = updatedPost;
    
    // Сохраняем обновленные данные
    await writeData(updatedPosts);
    
    return updatedPost;
  } catch (error) {
    throw new Error(`Не удалось обновить пост ${id}`);
  }
};

// PATCH - частичное обновление поста
export const patchPost = async (id, postData) => {
  try {
    const posts = await getPosts();
    const postIndex = posts.findIndex(post => post.id === parseInt(id));
    
    if (postIndex === -1) {
      throw new Error(`Пост с ID ${id} не найден`);
    }
    
    // Частично обновляем пост
    const updatedPost = {
      ...posts[postIndex],
      ...postData,
      id: parseInt(id) // Сохраняем оригинальный ID
    };
    
    // Обновляем массив постов
    const updatedPosts = [...posts];
    updatedPosts[postIndex] = updatedPost;
    
    // Сохраняем обновленные данные
    await writeData(updatedPosts);
    
    return updatedPost;
  } catch (error) {
    throw new Error(`Не удалось частично обновить пост ${id}`);
  }
};

// DELETE - удаление поста
export const deletePost = async (id) => {
  try {
    const posts = await getPosts();
    const postIndex = posts.findIndex(post => post.id === parseInt(id));
    
    if (postIndex === -1) {
      throw new Error(`Пост с ID ${id} не найден`);
    }
    
    // Удаляем пост из массива
    const updatedPosts = posts.filter(post => post.id !== parseInt(id));
    
    // Сохраняем обновленные данные
    await writeData(updatedPosts);
    
    return id;
  } catch (error) {
    throw new Error(`Не удалось удалить пост ${id}`);
  }
};

// Сброс данных к исходным из JSON файла
export const resetPosts = async () => {
  try {
    localStorage.removeItem('posts');
    const originalPosts = await readData();
    return originalPosts;
  } catch (error) {
    throw new Error('Не удалось сбросить данные');
  }
};
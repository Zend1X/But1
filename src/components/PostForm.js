import React, { useState } from 'react';
import './PostForm.css';

const PostForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    body: initialData?.body || '',
    userId: initialData?.userId || 1,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Заголовок обязателен';
    }
    
    if (!formData.body.trim()) {
      newErrors.body = 'Содержание обязательно';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Редактировать пост' : 'Создать новый пост'}</h3>
      
      <div className="form-group">
        <label htmlFor="title">Заголовок:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
          placeholder="Введите заголовок поста"
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="body">Содержание:</label>
        <textarea
          id="body"
          name="body"
          value={formData.body}
          onChange={handleChange}
          rows="4"
          className={errors.body ? 'error' : ''}
          placeholder="Введите содержание поста"
        />
        {errors.body && <span className="error-message">{errors.body}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="userId">ID пользователя:</label>
        <input
          type="number"
          id="userId"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          min="1"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {initialData ? 'Обновить пост' : 'Создать пост'}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default PostForm;
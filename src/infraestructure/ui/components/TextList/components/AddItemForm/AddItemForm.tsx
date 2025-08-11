import React, { useState } from 'react';
import styles from './AddItemForm.module.css';

export interface AddItemFormProps {
  onSubmit: (value: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setError('The text cannot be empty');
      return;
    }

    setError('');
    onSubmit(trimmedValue);
    setValue('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    if (error) {
      setError('');
    }
  };

  const handleCancel = () => {
    setValue('');
    setError('');
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor='text-input' className={styles.label}>
          Add item to list
        </label>
        <input
          id='text-input'
          type='text'
          value={value}
          onChange={handleInputChange}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          placeholder='Type the text here...'
          disabled={isLoading}
          maxLength={100}
          autoFocus
        />
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>

      <div className={styles.actions}>
        <button
          type='submit'
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add'}
        </button>
        <button
          type='button'
          onClick={handleCancel}
          className={styles.cancelButton}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

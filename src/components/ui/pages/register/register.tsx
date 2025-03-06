import { FC } from 'react';
import {
  Input,
  Button,
  PasswordInput
} from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { RegisterUIProps } from './type';

export const RegisterUI: FC<RegisterUIProps> = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  errorText,
  handleSubmit
}) => {
  const noop = () => {}; // Empty function for event handlers we don't need

  return (
    <main className={styles.container}>
      <div className={`pt-6 ${styles.wrapCenter}`}>
        <h3 className='pb-6 text text_type_main-medium'>Регистрация</h3>
        <form
          className={`pb-15 ${styles.form}`}
          name='register'
          onSubmit={handleSubmit}
        >
          <>
            <div className='pb-6'>
              <Input
                type='text'
                placeholder='Имя'
                onChange={(e) => setName(e.target.value)}
                value={name}
                name='name'
                error={false}
                errorText=''
                size='default'
                onBlur={noop}
                onFocus={noop}
                onIconClick={noop}
                onPointerEnterCapture={noop}
                onPointerLeaveCapture={noop}
              />
            </div>
            <div className='pb-6'>
              <Input
                type='email'
                placeholder='E-mail'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                name='email'
                error={false}
                errorText=''
                size='default'
                onBlur={noop}
                onFocus={noop}
                onIconClick={noop}
                onPointerEnterCapture={noop}
                onPointerLeaveCapture={noop}
              />
            </div>
            <div className='pb-6'>
              <PasswordInput
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                name='password'
              />
            </div>
            <div className={`pb-6 ${styles.button}`}>
              <Button type='primary' size='medium' htmlType='submit'>
                Зарегистрироваться
              </Button>
            </div>
            {errorText && (
              <p className={`${styles.error} text text_type_main-default pb-6`}>
                {errorText}
              </p>
            )}
          </>
        </form>
        <div className={`${styles.question} text text_type_main-default pb-6`}>
          Уже зарегистрированы?
          <Link to='/login' className={`pl-2 ${styles.link}`}>
            Войти
          </Link>
        </div>
      </div>
    </main>
  );
};

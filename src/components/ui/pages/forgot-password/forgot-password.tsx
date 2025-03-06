import { FC } from 'react';

import { Input, Button } from '@zlden/react-developer-burger-ui-components';
import styles from '../common.module.css';
import { Link } from 'react-router-dom';
import { ForgotPasswordUIProps } from './type';

export const ForgotPasswordUI: FC<ForgotPasswordUIProps> = ({
  email,
  setEmail,
  errorText,
  handleSubmit
}) => {
  const noop = () => {}; // Empty function for event handlers we don't need

  return (
    <main className={styles.container}>
      <div className={`pt-6 ${styles.wrapCenter}`}>
        <h3 className='pb-6 text text_type_main-medium'>
          Восстановление пароля
        </h3>
        <form
          className={`pb-15 ${styles.form}`}
          name='forgot-password'
          onSubmit={handleSubmit}
        >
          <>
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
            <div className={`pb-6 ${styles.button}`}>
              <Button type='primary' size='medium' htmlType='submit'>
                Восстановить
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
          Вспомнили пароль?
          <Link to='/login' className={`pl-2 ${styles.link}`}>
            Войти
          </Link>
        </div>
      </div>
    </main>
  );
};

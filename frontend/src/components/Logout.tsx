import React from 'react';
import {Button} from 'antd';
import {useDispatch, history} from 'umi';

const Logout: React.FC = function () {
  const dispatch = useDispatch();

  const onClick = async () => {
    await dispatch({type: 'user/logout'});
    history.push('/');
  };

  return <Button onClick={onClick}>Logout</Button>;
};

export default Logout;

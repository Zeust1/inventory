import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';
import usersAPI from '../../apis/usersAPI.jsx';
import { toast } from 'react-toastify';



const AuthForm = ({usersData}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(null);

  const { postUser, sendOtpToEmail } = usersAPI()

  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const isAuth = usersData.find(
        (item) => item.email == email && item.password == password
      );
      if (isAuth) {
        toast.success('Đăng nhập thành công');
        localStorage.setItem('token', JSON.stringify({ email }));
        navigate('/dashboard');
      } else {
        toast.error('Sai email hoặc mật khẩu');
      }
    } else {
      // Đăng ký
      if (!isOtpSent) {
        if (password !== confirmPassword) {
          return toast.warn('Xác thực mật khẩu không đúng');
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
        setIsOtpSent(true);
        const responeSendOtpEmail = await sendOtpToEmail(email, newOtp)
        toast.info(responeSendOtpEmail.data.message);
      } else {
        // Xác nhận OTP
        if (otp === generatedOtp) {
          postUser({ email, password, otp }); // Ghi vào Sheet
          toast.success('Đăng ký thành công, vui lòng đăng nhập.');
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
          setOtp('');
          setIsOtpSent(false);
        } else {
          toast.error('OTP không chính xác');
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">{isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}</h2>

      <input
        type="text"
        className="input-field"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        className="input-field"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {!isLogin && !isOtpSent && (
        <input
          type="password"
          className="input-field"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      )}

      {!isLogin && isOtpSent && (
        <input
          type="text"
          className="input-field"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      )}

      <button className="submit-button">
        {isLogin ? 'Đăng nhập' : isOtpSent ? 'Xác nhận OTP' : 'Gửi mã OTP'}
      </button>

      <p className="form-switch">
        {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
        <button
          type="button"
          className="link-button"
          onClick={() => {
            setIsLogin(!isLogin);
            setIsOtpSent(false);
            setOtp('');
          }}
        >
          {isLogin ? ' Đăng ký' : ' Đăng nhập'}
        </button>
      </p>
    </form>
  );
};

export default AuthForm;

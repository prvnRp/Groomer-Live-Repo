import '../App.css';
import logo from '../images/groomerLogo.png';
import '../Styles/logo.css'
import { useBlur } from '../context/blurContext';
import { NavLink } from 'react-router-dom';

function Logo() {
    const { isBlur } = useBlur();


    return (
        <NavLink to="/"><img src={logo} alt="Logo" className="logo" style={{ filter: isBlur ? 'blur(10px)' : 'none' }} /></NavLink>
    );
}

export default Logo;
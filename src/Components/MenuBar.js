import '../App.css';
import { NavLink } from 'react-router-dom';


// The MenuBar component provides a dropdown menu for navigation.


function MenuBar() {
    return (
        <div className="dropdownMenu">
            <ul>
                <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                </li>
                <li>
                    <NavLink to="/wishlist">Wishlist</NavLink>
                </li>
            </ul>
        </div>
    );
}

export default MenuBar;
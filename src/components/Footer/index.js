import React from 'react'
import {Link} from 'react-router-dom'
import './Footer.css'

export default function Footer(){
    return (
        <footer>
            <ul>
                <li>
                    <Link to="/cgu" className="footer-link">CGU</Link>
                </li>
                <li>
                    <Link to="/faq" className="footer-link">FAQ</Link>
                </li>
                <li>
                    <a className="footer-link" href="mailto:contact@instantvisio.com">Nous contacter</a>
                </li>
            </ul>
        </footer>
    )
}
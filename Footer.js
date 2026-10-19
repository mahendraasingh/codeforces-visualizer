import React from "react";

const Footer = () => {
    return (
        <footer id="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Codeforces Visualizer. All rights reserved.</p>
                <ul className="social-links">
                    <li><a href="https://codeforces.com" target="_blank" rel="noopener noreferrer">Codeforces</a></li>
                    <li><a href="https://github.com/mahendraasingh" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                    <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                    <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light'
    );

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const localTheme = localStorage.getItem('theme');
        document.querySelector('html').setAttribute('data-theme', localTheme);
    }, [theme]);

    const handleToggle = (e) => {
        if (e.target.checked) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    };

    return (
        <label className="swap swap-rotate btn btn-ghost btn-circle">
        
            <input
                type="checkbox"
                onChange={handleToggle}
                checked={theme === 'dark'}
            />
            
            <Sun className="swap-on fill-current w-5 h-5" />
            <Moon className="swap-off fill-current w-5 h-5" />
        </label>
    );
};

export default ThemeToggle;

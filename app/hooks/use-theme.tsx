import { useContext } from 'react';
import { ThemeContext } from '~/store/theme';

const useTheme = () => useContext(ThemeContext);

export default useTheme;

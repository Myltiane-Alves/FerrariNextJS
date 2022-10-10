import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState
} from "react";

type MenuContextType = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const MenuContext = createContext<MenuContextType>({
    isOpen: false,
    setIsOpen: () => { }
})

type MenuProviderProps = {
    children: ReactNode;
}

export const MenuProvider = ({ children }: MenuProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('open-menu');
        } else {
            document.body.classList.remove('open-menu');
        }
    }, [isOpen]);

    return (
        <>
            <MenuContext.Provider value={{ isOpen, setIsOpen }}>
                {children}
            </MenuContext.Provider>
        </>
    )
}

export function useMenu() {
    const context = useContext(MenuContext);

    if (!context) {
        throw new Error('useMenu must be used within a MenuProvider');
    }

    return context;
}

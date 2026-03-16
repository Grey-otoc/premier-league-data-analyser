import Header from "./Header";

function MainLayout({ children }) {

    return (
        <>
            <Header />
           <div className="content">   
                {children}
            </div>

        </>
    );

}

export default MainLayout;
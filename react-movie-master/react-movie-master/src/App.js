import "swiper/swiper.min.css";
import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./App.scss";

import { BrowserRouter, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import Routes from "./routes/Routes";
import * as Config from "./constants/Config";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Route
          render={(props) => {
            const pathname = props.location.pathname;

            const isAuthPage =
              pathname === `/${Config.HOME_PAGE}/login` ||
              pathname === `/${Config.HOME_PAGE}/register`;

            return (
              <>
                {!isAuthPage && <Header {...props} />}

                <Routes />

                {!isAuthPage && <Footer />}
              </>
            );
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

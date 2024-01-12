import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { userToken, userProfile } from "./recoil";


// This is auth component who protect pages from unwanted access.
// Usage : export default auth(Component)

export const auth = (Component, level) => {
    const Route = (props) => {
        const [isReady, setReady] = useState(false);
        const profile = useRecoilValue(userProfile)
        const token = useRecoilValue(userToken);
        const router = useRouter();

        useEffect(() => {
            if (!token.accessToken) {
                return router.replace("/login");
            }
            if (level && !level.includes(profile.level)) {
                return router.replace("/");
            }

            setReady(true);
        }, []);

        if (!isReady) return <></>;
        return <Component {...props} />;
    };

    return Route;
};

export const authReverse = (Component, redirect = "/home") => {
    const Route = (props) => {
        const [isReady, setReady] = useState(false);
        const token = useRecoilValue(userToken);
        const router = useRouter();

        useEffect(() => {
            if (token.accessToken) {
                return router.replace(redirect);
            }
            setReady(true);
        }, []);

        if (!isReady) return <></>;
        return <Component {...props} />;
    };

    return Route;
};

export const authCheck = () => {
    const Route = () => {
        const token = useRecoilValue(userToken);
        const router = useRouter();

        useEffect(() => {
            if (token.isReady) {
                if (token.accessToken) {
                    return new Promise(resolve => resolve())
                } else {
                    router.replace("/login")
                }
            }
        }, [token])

    };

    return Route;
};

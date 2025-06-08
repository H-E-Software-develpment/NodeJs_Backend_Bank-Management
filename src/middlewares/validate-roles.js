export const hasRoles = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.userJwt) {
                return res.status(500).json({
                    success: false,
                    message: "It is necessary to verify your token before continuing."
                });
            };

            if (!roles.includes(req.userJwt.role)) {
                return res.status(401).json({
                    success: false,
                    message: `This service requires one of these roles: ${roles}`
                });
            };
            next();
        } catch (err) {
            res.status(500).json({
                success: false,
                msg: 'failed to check your role, please try again',
                error: err.message
            });
        }
    };
};

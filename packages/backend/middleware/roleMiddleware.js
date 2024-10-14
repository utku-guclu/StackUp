export const isAdmin = (req, res, next) => {
	if (req.user && req.user.role === 'admin') {
    	next();
	} else {
    	res.status(403).json({ message: "Access denied. Admin role required.", ok: false });
	}
};

export const isSeller = (req, res, next) => {
	if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    	next();
	} else {
    	res.status(403).json({ message: "Access denied. Seller role required.", ok: false });
	}
};

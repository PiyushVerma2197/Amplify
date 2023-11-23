import { useLocation, Navigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

export function RequireAuth({ children }) {
	const location = useLocation();
	const { authStatus } = useAuthenticator((context) => [context.authStatus]);
	if (authStatus !== 'authenticated') {
		return <Navigate to='/' state={{ authReqLocation: location }} replace />;
	}
	return children;
}

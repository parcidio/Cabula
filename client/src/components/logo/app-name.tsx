import { Link } from "react-router-dom";

const AppName = (props: { url?: string }) => {
  const { url = "/" } = props;
  return (
      <Link to={url}>
         Cabula
      </Link>
  );
};

export default AppName;

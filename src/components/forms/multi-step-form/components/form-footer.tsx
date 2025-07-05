// Libraries
import React from "react";
import { Link } from "react-aria-components";

export const FormFooter: React.FC = () => {
  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground">
        Powered by{" "}
        <span className="font-medium underline text-foreground">
          <Link href="https://ikiform.com">Ikiform</Link>
        </span>
      </p>
    </div>
  );
};

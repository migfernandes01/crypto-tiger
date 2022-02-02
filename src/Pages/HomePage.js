import React, { Suspense } from "react";                                  //React
import { ErrorBoundary } from "react-error-boundary";                     //Error boundaty                    
import Banner from "../components/Banner/Banner";                         //Banner component
import ErrorFallback from "../components/ErrorBoundary";                  //ErrorFallback component
// import CoinsTable from "../components/CoinsTable";
const CoinsTable = React.lazy(() => import("../components/CoinsTable"));  //Lazy load coins table component

const Homepage = () => {
  return (
    <div>
      <Banner />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        <Suspense fallback={<div></div>}>
          <CoinsTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Homepage;

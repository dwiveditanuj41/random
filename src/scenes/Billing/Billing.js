import React from 'react';
import styled from 'styled-components';
import { Segment, Image } from '@indshine/ui-kit';

import AppShell from '../../components/AppShell';

const Billing = () => {
  return (
    <AppShell>
      <StyledSegment placeholder padded size="big" textAlign="center" basic>
        <Image
          src={require('../../images/billing-placeholder.svg')}
          alt="Billing"
          centered
          size="medium"
        />
        <h3>Billing Coming Soon!!</h3>
      </StyledSegment>
    </AppShell>
  );
};

export default Billing;

const StyledSegment = styled(Segment)`
  width: 80% !important;
  margin: 0 auto !important;
`;

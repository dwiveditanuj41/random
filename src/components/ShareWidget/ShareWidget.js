import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@indshine/ui-kit';

import ShareWidgetContent from './components/ShareWidgetContent';

const ShareWidget = ({ trigger, projectId }) => {
  return (
    <Dialog trigger={trigger} size="tiny">
      {({ closeModal }) => (
        <ShareWidgetContent closeModal={closeModal} projectId={projectId} />
      )}
    </Dialog>
  );
};

ShareWidget.propTypes = {
  trigger: PropTypes.node.isRequired,
  projectId: PropTypes.string.isRequired,
};

export default ShareWidget;

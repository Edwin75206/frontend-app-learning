import React from 'react';
import { useSelector } from 'react-redux';
import myFavicon from './favicon.png';
import { sendTrackingLogEvent } from '@edx/frontend-platform/analytics';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookmark, faCertificate, faInfo, faCalendar, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons';

import messages from '../messages';
import { useModel } from '../../../generic/model-store';
import LaunchCourseHomeTourButton from '../../../product-tours/newUserCourseHomeTour/LaunchCourseHomeTourButton';
import './estilosTools.scss';

const CourseTools = ({ intl }) => {
  const { courseId } = useSelector(state => state.courseHome);
  // Obtenemos la organización a la que pertenece el curso
  const { org } = useModel('courseHomeMeta', courseId);
  const { courseTools } = useModel('outline', courseId);

  if (courseTools.length === 0) {
    return null;
  }

  const eventProperties = {
    org_key: org,
    courserun_key: courseId,
  };

  const logClick = (analyticsId) => {
    const { administrator } = getAuthenticatedUser();
    sendTrackingLogEvent('edx.course.tool.accessed', {
      ...eventProperties,
      course_id: courseId, // se mantiene courseId por motivos históricos
      is_staff: administrator,
      tool_name: analyticsId,
    });
  };

  const renderIcon = (iconClasses) => {
    switch (iconClasses) {
      case 'edx.bookmarks':
        return faBookmark;
      case 'edx.tool.verified_upgrade':
        return faCertificate;
      case 'edx.tool.financial_assistance':
        return faInfo;
      case 'edx.calendar-sync':
        return faCalendar;
      case 'edx.updates':
        return faNewspaper;
      case 'edx.reviews':
        return faStar;
      default:
        return null;
    }
  };

  // Asigna la clase dinámica según la organización
  const titleClass =
    org === 'Unimec'
      ? 'my-h4-unimec'
      : org === 'Primaria'
      ? 'my-h4-primaria'
      : 'my-h4';

      return (
        <section className="mb-4">
          <h2 className={titleClass}>
            {intl.formatMessage(messages.tools)}
          </h2>
          <img src={myFavicon} alt="Descripción de la imagen" width="200" />
      
          {/* Texto de la biblioteca */}
          <div className="library-reminder mt-3">
            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#333' }}>
              📚 <strong>Recuerda que siempre tienes disponible la Biblioteca.</strong><br />
              En el menú de la izquierda encontrarás acceso a materiales adicionales, libros, artículos, los libros de texto oficiales y mucho más para complementar tu aprendizaje.
            </p>
          </div>
        </section>
      );
      
};

CourseTools.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CourseTools);
